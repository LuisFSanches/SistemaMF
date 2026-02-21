import {
    CardWrapper,
    LogoTop,
    ContentWrapper,
    CardFrom,
    CardTo,
    CardMessage,
    StoreInfoContainer,
    StoreInfoItem
} from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface CardTemplateProps {
    cardFrom?: string;
    cardTo?: string;
    cardMessage: string;
    fontSize: number;
    orderCode?: string;
    logo?: string;
    backgroundImage?: string;
    elementId?: string;
    instagram?: string;
    phoneNumber?: string;
    referencePoint?: string;
}

export const CardTemplate = ({ cardFrom, cardTo, cardMessage, fontSize, orderCode, logo, backgroundImage = 'card_background_1.png', elementId = 'card-to-print', instagram, phoneNumber, referencePoint }: CardTemplateProps) => {   
    return (
        <CardWrapper id={elementId} $backgroundImage={backgroundImage}>
            <ContentWrapper>
                <LogoTop src={logo} alt="" />
                {cardFrom && <CardFrom fontSize={fontSize}>De: {cardFrom}</CardFrom>}
                {cardTo && <CardTo fontSize={fontSize}>Para: {cardTo}</CardTo>}
                {cardMessage && <CardMessage fontSize={fontSize}>{cardMessage}</CardMessage>}
            </ContentWrapper>
            
            <StoreInfoContainer>
                {logo && <img src={logo} alt="Logo" />}
                <div className="store-info">
                    {instagram && (
                        <StoreInfoItem>
                            <FontAwesomeIcon icon={faInstagram as IconProp} />
                            <span>@{instagram}</span>
                        </StoreInfoItem>
                    )}
                    {phoneNumber && (
                        <StoreInfoItem>
                            <FontAwesomeIcon icon={faWhatsapp as IconProp} />
                            <span>{phoneNumber}</span>
                        </StoreInfoItem>
                    )}
                    {referencePoint && (
                        <StoreInfoItem>
                            <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} />
                            <span>{referencePoint}</span>
                        </StoreInfoItem>
                    )}
                    {orderCode && (
                        <StoreInfoItem>
                            <span>Pedido #{orderCode}</span>
                        </StoreInfoItem>
                    )}
                </div>
            </StoreInfoContainer>
        </CardWrapper>
    );
};
