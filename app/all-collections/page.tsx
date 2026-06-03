"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { api } from "@/lib/axios";
import { Folder } from "lucide-react";

interface Category {
  _id: string;
  title: string;
  image?: string;
  count: number;
}

export default function AllCollectionPage() {
  const [collections, setCollections] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchCollections = async (pageNumber: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get(`/category?page=${pageNumber}&limit=10`);
      const newCollections = res.data.data || [];
      const totalRecords = res.data.pagination?.totalRecords || 0;
      
      setCollections((prev) => {
        // Prevent duplicates
        const existingIds = new Set(prev.map(c => c._id));
        const filteredNew = newCollections.filter((c: Category) => !existingIds.has(c._id));
        return [...prev, ...filteredNew];
      });

      if (collections.length + newCollections.length >= totalRecords || newCollections.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchCollections(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <Header />

      {/* Collection Banner */}
      <div className="relative overflow-hidden mb-12 h-[250px] md:h-[350px]">
        <Image
          src="/images/all-collection.jpeg"
          alt="Collections Banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <span className="uppercase tracking-[4px] text-sm mb-3">
            Discover More
          </span>

          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl">
            Explore Every Collection In One Place
          </h2>

          <p className="mt-4 text-white/90 max-w-xl">
            Kitchen essentials, home gadgets, lifestyle products and much more.
          </p>
        </div>
      </div>

      <section className="w-full py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Collection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((item, index) => {
              const isLastElement = index === collections.length - 1;
              return (
                <Link
                  key={item._id}
                  href={`/category?category=${encodeURIComponent(item.title)}`}
                  className="block"
                  ref={isLastElement ? lastElementRef : null}
                >
                  <div className="relative overflow-hidden rounded-[28px] group shadow-md hover:shadow-xl transition duration-300 bg-white cursor-pointer border border-slate-100">
                    {/* Image */}
                    <div className="relative h-[420px] overflow-hidden bg-slate-50 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <Folder className="w-16 h-16 text-slate-300" />
                      )}
                    </div>

                    {/* Bottom Floating Card */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[85%] py-3 px-3 text-center border border-slate-100">
                      <h3 className="text-lg font-semibold text-black truncate px-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        ({item.count || 0} Products)
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {loading && (
            <div className="w-full flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full"></div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
