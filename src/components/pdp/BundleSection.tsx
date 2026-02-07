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
      className="py-12 md:py-16 px-4"
      aria-labelledby="complete-the-space-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          id="complete-the-space-heading"
          className="text-xl md:text-2xl font-medium text-foreground tracking-tight mb-8 md:mb-10"
        >
          Complete the space
        </h2>
        <div className="space-y-14 md:space-y-20">
          {bundles.map((group) => (
            <div
              key={group.title}
              className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10"
            >
              <div className="w-full md:w-[45%] lg:w-[40%] shrink-0">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary/50">
                  <Image
                    src={group.media}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {group.subtitle && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {group.subtitle}
                  </p>
                )}
                <h3 className="text-lg font-medium text-foreground mb-6">
                  {group.title}
                </h3>
                <ul className="space-y-4 mb-6">
                  {group.items.map((item) => (
                    <li key={item.variantId} className="flex items-center gap-4">
                      <Link
                        href={`/products/${item.handle}`}
                        className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-secondary/50"
                      >
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.handle}`}
                          className="text-sm font-medium text-foreground hover:underline block truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {group.savings && (
                  <p className="text-sm text-foreground font-medium mb-4">
                    Bundle savings: {group.savings}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-foreground/20 hover:bg-foreground/5"
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
