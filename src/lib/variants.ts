import type { Variant } from "@/lib/shopify/types";

/**
 * 初期状態のselectedOptionsを生成（すべてnull）
 */
export function normalizeSelectedOptions(
  options: Array<{ name: string; values: string[] }>
): Record<string, string | null> {
  const normalized: Record<string, string | null> = {};
  options.forEach((option) => {
    normalized[option.name] = null;
  });
  return normalized;
}

/**
 * selectedOptionsから該当するvariantを検索
 * 未選択が残る場合はnullを返す
 */
export function findVariantBySelectedOptions(
  variants: Variant[],
  selectedOptions: Record<string, string | null>
): Variant | null {
  // 未選択が残っている場合はnull
  const allSelected = Object.values(selectedOptions).every(
    (value) => value !== null
  );
  if (!allSelected) {
    return null;
  }

  // 完全一致するvariantを探す
  return (
    variants.find((variant) => {
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        const variantOption = variant.selectedOptions?.find(
          (opt) => opt.name === optionName
        );
        return variantOption?.value === optionValue;
      });
    }) || null
  );
}

/**
 * 指定されたoptionValueが選択可能かどうかを判定
 * 将来的に在庫ありのvariantが成立するかどうかをチェック
 */
export function isOptionValueSelectable(
  variants: Variant[],
  selectedOptions: Record<string, string | null>,
  optionName: string,
  optionValue: string
): boolean {
  // 仮のselectedOptionsを作成
  const draftOptions: Record<string, string | null> = {
    ...selectedOptions,
    [optionName]: optionValue,
  };

  // 未選択の軸はワイルドカード扱い（すべての値とマッチ）
  // 条件を満たすavailableForSale=trueのvariantが存在するかチェック
  return variants.some((variant) => {
    // availableForSaleがfalseのvariantは無視
    if (!variant.availableForSale) {
      return false;
    }

    // draftOptionsのすべての選択済みオプションと一致するかチェック
    return Object.entries(draftOptions).every(([optName, optValue]) => {
      if (optValue === null) {
        // 未選択の軸はワイルドカード扱い
        return true;
      }

      const variantOption = variant.selectedOptions?.find(
        (opt) => opt.name === optName
      );
      return variantOption?.value === optValue;
    });
  });
}

/**
 * オプション変更を適用し、必要に応じてsecondaryをリセット
 * @returns { nextSelectedOptions, didResetSecondary }
 */
export function applyOptionChangeWithReset({
  selectedOptions,
  variants,
  primaryName,
  secondaryName,
  changedName,
  nextValue,
}: {
  selectedOptions: Record<string, string | null>;
  variants: Variant[];
  primaryName: string;
  secondaryName: string;
  changedName: string;
  nextValue: string | null;
}): {
  nextSelectedOptions: Record<string, string | null>;
  didResetSecondary: boolean;
} {
  // 変更を適用したdraftを作成
  const draft: Record<string, string | null> = {
    ...selectedOptions,
    [changedName]: nextValue,
  };

  let didResetSecondary = false;

  // primaryが変更された場合
  if (changedName === primaryName && secondaryName) {
    // 元のselectedOptionsからsecondaryの値を取得（変更前の値）
    const currentSecondaryValue = selectedOptions[secondaryName];

    // secondaryが選択済みの場合
    if (currentSecondaryValue !== null) {
      // 新しいprimary値と現在のsecondary値の組み合わせでavailableForSale=trueのvariantが存在するかチェック
      const newPrimaryValue = draft[primaryName]; // 変更後のprimary値

      const hasAvailableVariant = variants.some((variant) => {
        // availableForSaleがfalseのvariantは無視
        if (!variant.availableForSale) {
          return false;
        }

        // primaryとsecondaryの両方が一致するかチェック
        const primaryOption = variant.selectedOptions?.find(
          (opt) => opt.name === primaryName
        );
        const secondaryOption = variant.selectedOptions?.find(
          (opt) => opt.name === secondaryName
        );

        // 新しいprimary値と現在のsecondary値が一致するvariantが存在するか
        const primaryMatches = primaryOption?.value === newPrimaryValue;
        const secondaryMatches = secondaryOption?.value === currentSecondaryValue;

        return primaryMatches && secondaryMatches;
      });

      // 成立しない場合はsecondaryをnullにリセット
      if (!hasAvailableVariant) {
        draft[secondaryName] = null;
        didResetSecondary = true;
      }
    }
  }

  return {
    nextSelectedOptions: draft,
    didResetSecondary,
  };
}
