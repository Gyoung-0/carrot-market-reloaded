import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  tags: ["product", "list"],
});

fetch("http://api.com", {
  next: {
    revalidate: 50,
    tags: ["products"],
  },
});

async function getInitialProducts() {
  console.log("hit!!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export const dynamic = "force-dynamic";
// export const revalidate = 60;

// ✅ Prisma 없이 타입 추론
export type InitialProducts = Awaited<ReturnType<typeof getInitialProducts>>;

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  return (
    <div>
      <Link href="/home/recent">Recent products</Link>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
