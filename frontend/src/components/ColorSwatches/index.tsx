import { IStoreProductVariant } from "../../interfaces/IProductVariant";
import { SwatchList, Swatch, MoreLabel, SelectedLabel } from "./style";

interface ColorSwatchesProps {
    variants: IStoreProductVariant[];
    selectedId: string;
    onSelect: (variant: IStoreProductVariant) => void;
    size?: number;
    maxVisible?: number;
    showSelectedLabel?: boolean;
}

export function ColorSwatches({
    variants,
    selectedId,
    onSelect,
    size = 22,
    maxVisible,
    showSelectedLabel = false
}: ColorSwatchesProps) {
    const visibleVariants = maxVisible ? variants.slice(0, maxVisible) : variants;
    const hiddenCount = variants.length - visibleVariants.length;
    const selected = variants.find(variant => variant.id === selectedId);

    return (
        <div>
            {showSelectedLabel && selected?.color && (
                <SelectedLabel>
                    Cor: <strong>{selected.color.name}</strong>
                    {!selected.available && ' (indisponível)'}
                </SelectedLabel>
            )}
            <SwatchList role="radiogroup" aria-label="Cores disponíveis">
                {visibleVariants.map(variant => (
                    <Swatch
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={variant.id === selectedId}
                        aria-label={variant.color?.name || variant.name}
                        title={`${variant.color?.name || variant.name}${variant.available ? '' : ' (indisponível)'}`}
                        $hex={variant.color?.hex || null}
                        $mixed={!!variant.color?.is_mixed}
                        $selected={variant.id === selectedId}
                        $size={size}
                        disabled={!variant.available}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(variant);
                        }}
                    />
                ))}
                {hiddenCount > 0 && <MoreLabel>+{hiddenCount}</MoreLabel>}
            </SwatchList>
        </div>
    );
}
