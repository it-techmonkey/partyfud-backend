import prisma from "../lib/prisma";

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Backfill slugs for all catererinfo records that don't have one
 */
async function backfillSlugs() {
  console.log("Starting caterer slug backfill...");

  const caterers = await prisma.catererinfo.findMany({
    where: { slug: null },
    select: {
      id: true,
      business_name: true,
      caterer_id: true,
    },
  });

  console.log(`Found ${caterers.length} caterers without slugs`);

  let updated = 0;
  let errors = 0;

  for (const caterer of caterers) {
    try {
      let baseSlug = generateSlug(caterer.business_name || "caterer");
      if (!baseSlug) baseSlug = "caterer";

      let slug = baseSlug;
      let counter = 1;

      // Keep trying until we find a unique slug
      while (true) {
        const existing = await prisma.catererinfo.findUnique({
          where: { slug },
          select: { id: true },
        });

        if (!existing || existing.id === caterer.id) {
          break;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.catererinfo.update({
        where: { id: caterer.id },
        data: { slug },
      });

      console.log(`  ✓ ${caterer.business_name} → ${slug}`);
      updated++;
    } catch (err) {
      console.error(`  ✗ Failed for ${caterer.business_name}:`, err);
      errors++;
    }
  }

  console.log(`\nBackfill complete: ${updated} updated, ${errors} errors`);
}

backfillSlugs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
