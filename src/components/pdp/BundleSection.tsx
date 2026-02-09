"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { BundleGroup } from "./types";

interface BundleSectionProps {
  bundles: BundleGroup[];
}

export default function BundleSection({ bundles }: BundleSectionProps) {
  const addMultiple = useCart((s) => s.addMultiple);
  const add = useCart((s) => s.add);
  const init = useCart((s) => s.init);
  const { toast } = useToast();
  const [addingGroupId, setAddingGroupId] = useState<string | null>(null);

  if (!bundles.length) return null;

  const handleAddSet = async function (group: BundleGroup) {
    const groupId = group.title;
    setAddingGroupId(groupId);
    const lines = group.items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: 1,
    }));

    try {
      let cartId = useCart.getState().cartId;
      if (!cartId) {
        await init();
        cartId = useCart.getState().cartId;
      }
      if (!cartId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load cart. Please try again.",
        });
        return;
      }

      const result = await addMultiple(lines);
      if (result.success) {
        toast({
          variant: "success",
          title: "Set added to cart",
          description: `${group.items.length} item(s) added.`,
        });
      } else {
        // Fallback: add sequentially when bulk add failed (e.g. one item sold out)
        let added = 0;
        const failed: string[] = [];
        for (const item of group.items) {
          const result = await add(item.variantId, 1);
          if (result.success) added++;
          else failed.push(item.title);
        }
        if (added > 0) {
          toast({
            variant: "success",
            title: "Partially added",
            description: `${added} item(s) added.${failed.length ? ` Could not add: ${failed.slice(0, 2).join(", ")}${failed.length > 2 ? "…" : ""}` : ""}`,
          });
        } else if (failed.length === group.items.length) {
          toast({
            variant: "destructive",
            title: "Could not add set",
            description: "Some items may be sold out. Try adding individually.",
          });
        }
      }
    } finally {
      setAddingGroupId(null);
    }
  };

  return (
    <section
      className="py-12 md:py-20 px-4 md:px-6 lg:px-8"
      aria-labelledby="complete-the-space-heading"
    >
      <div className="container mx-auto max-w-7xl">
        <h2
          id="complete-the-space-heading"
          className="text-xl md:text-3xl font-medium text-foreground tracking-tight mb-10 md:mb-14"
        >
          Complete the space
        </h2>
        <div className="space-y-16 md:space-y-24">
          {bundles.map((group) => (
            <div
              key={group.title}
              className="flex flex-col lg:flex-row lg:items-start gap-10 md:gap-12 lg:gap-16"
            >
              <div className="w-full lg:w-[50%] xl:w-[55%] shrink-0">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary/50">
                  <Image
                    src={group.media}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 lg:pt-2">
                {group.subtitle && (
                  <p className="text-sm md:text-base text-muted-foreground mb-3">
                    {group.subtitle}
                  </p>
                )}
                <h3 className="text-lg md:text-xl font-medium text-foreground mb-8">
                  {group.title}
                </h3>
                <ul className="space-y-5 md:space-y-6 mb-8">
                  {group.items.map((item) => {
                    const isOnSale =
                      item.compareAtPrice != null &&
                      item.compareAtPrice > item.price;
                    return (
                      <li
                        key={item.variantId}
                        className="flex items-center gap-4 md:gap-6"
                      >
                        <Link
                          href={`/products/${item.handle}`}
                          className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-secondary/50"
                        >
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 80px"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.handle}`}
                            className="text-sm md:text-base font-medium text-foreground hover:underline block truncate"
                          >
                            {item.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                            {isOnSale ? (
                              <>
                                <span className="text-sm text-gray-400 line-through font-normal">
                                  {formatPrice(item.compareAtPrice!)}
                                </span>
                                <span className="text-base md:text-lg font-semibold text-red-600">
                                  {formatPrice(item.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-base md:text-lg text-muted-foreground font-medium">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {group.savings && (
                  <p className="text-sm md:text-base text-foreground font-medium mb-5">
                    Bundle savings: {group.savings}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base border-foreground/20 hover:bg-foreground/5"
                  onClick={() => handleAddSet(group)}
                  disabled={addingGroupId === group.title}
                >
                  {addingGroupId === group.title ? "Adding…" : "Add set to cart"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
