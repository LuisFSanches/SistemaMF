import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import {
    Container,
    StarsContainer,
    RatingValue,
    ReviewCount,
    Tagline,
    ReviewButton
} from "./style";

interface GoogleRatingProps {
    ratingValue: number;
    ratingCount: number;
    ratingUrl: string;
}

export function GoogleRating({ ratingValue, ratingCount, ratingUrl }: GoogleRatingProps) {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Estrelas preenchidas
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={`full-${i}`}
                    icon={faStar as any}
                    className="star filled"
                />
            );
        }

        // Meia estrela
        if (hasHalfStar) {
            stars.push(
                <FontAwesomeIcon
                    key="half"
                    icon={faStarHalfAlt as any}
                    className="star filled"
                />
            );
        }

        // Estrelas vazias
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={`empty-${i}`}
                    icon={faStarEmpty as any}
                    className="star empty"
                />
            );
        }

        return stars;
    };

    return (
        <Container>
            <Tagline>Flores que encantam, avaliações que comprovam. Confira as avaliações deixadas por nossos clientes</Tagline>
            <StarsContainer>{renderStars()}</StarsContainer>
            <RatingValue>{ratingValue.toFixed(1)}</RatingValue>
            <ReviewCount>
                {ratingCount} {ratingCount === 1 ? 'avaliação' : 'avaliações'}
            </ReviewCount>
            <ReviewButton
                href={ratingUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                Ver todas as avaliações
            </ReviewButton>
        </Container>
    );
}
