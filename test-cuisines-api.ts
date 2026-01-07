import { getAllCatererInfo } from './src/api/admin/catererinfo/catererinfo.services';

(async () => {
  console.log('Testing cuisines API...\n');
  
  const result = await getAllCatererInfo({ status: 'APPROVED' });
  
  console.log(`Total approved caterers: ${result.length}`);
  console.log(`\nCaterers with cuisines:`);
  
  result.forEach((c, idx) => {
    if (c.cuisines && c.cuisines.length > 0) {
      console.log(`${idx + 1}. ${c.business_name}: [${c.cuisines.join(', ')}]`);
    }
  });
  
  console.log(`\nCaterers without cuisines:`);
  result.forEach((c, idx) => {
    if (!c.cuisines || c.cuisines.length === 0) {
      console.log(`${idx + 1}. ${c.business_name}: []`);
    }
  });
  
  process.exit(0);
})();
