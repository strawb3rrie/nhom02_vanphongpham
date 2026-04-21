export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/data/product.json", { // 
      cache: "no-store", // 
    });

    if (!res.ok) throw new Error("Fetch failed");

    return res.json(); // 
  } catch (err) {
    console.log("error"); // 

    const data = await import("../../public/data/products.json"); // 
    return data.default as unknown as Product[]; // 
  }
}