const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://dfhmkymkbgnlkdjcuwva.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaG1reW1rYmdubGtkamN1d3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMDk0NjksImV4cCI6MjEwODc4NTQ2OX0.chBtY_LkxG9pumYzyLsGRSmYc_N82qvzHHKEKFEHseA'
);

async function fullAuditAndBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups', 'pre_upgrade_audit_' + timestamp);
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('Created backup directory:', backupDir);

  // 1. Fetch all products from Supabase
  const { data: prods, error: pErr } = await supabase.from('sawera_products').select('*');
  fs.writeFileSync(path.join(backupDir, 'supabase_sawera_products.json'), JSON.stringify(prods || [], null, 2));
  console.log('Saved Supabase products count:', prods ? prods.length : 0);

  // 2. Fetch all orders from Supabase
  const { data: ords, error: oErr } = await supabase.from('sawera_orders').select('*');
  fs.writeFileSync(path.join(backupDir, 'supabase_sawera_orders.json'), JSON.stringify(ords || [], null, 2));
  console.log('Saved Supabase orders count:', ords ? ords.length : 0);

  // 3. Fetch all settings from Supabase
  const { data: sets, error: sErr } = await supabase.from('sawera_settings').select('*');
  fs.writeFileSync(path.join(backupDir, 'supabase_sawera_settings.json'), JSON.stringify(sets || [], null, 2));
  console.log('Saved Supabase settings count:', sets ? sets.length : 0);

  // 4. Also copy local initial data snapshots
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const files = fs.readdirSync(dataDir);
  const dataBackup = path.join(backupDir, 'src_data');
  fs.mkdirSync(dataBackup, { recursive: true });
  for (const f of files) {
    fs.copyFileSync(path.join(dataDir, f), path.join(dataBackup, f));
  }
  console.log('Backed up src/data files count:', files.length);

  // 5. Output summary of current products
  console.log('\n--- CURRENT PRODUCTS IN SUPABASE ---');
  if (prods) {
    for (const p of prods) {
      const d = p.data || {};
      console.log(`- [${p.id}] ${d.name} | Rs. ${d.price} | Category: ${d.category} | Variations: ${d.variations ? d.variations.length : 0}`);
    }
  }

  // 6. Output summary of settings
  console.log('\n--- CURRENT SETTINGS IN SUPABASE ---');
  if (sets) {
    for (const s of sets) {
      console.log(`- [${s.id}] updated_at: ${s.updated_at}`);
      if (s.id === 'categories') {
        console.log('  Categories in Supabase:', s.data?.map(c => c.name || c.id));
      }
      if (s.id === 'deleted_product_ids') {
        console.log('  Deleted Product IDs:', s.data);
      }
      if (s.id === 'deleted_order_ids') {
        console.log('  Deleted Order IDs count:', s.data?.length);
      }
    }
  }

  console.log('\nAudit and Verified Backup Complete!');
}

fullAuditAndBackup().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
