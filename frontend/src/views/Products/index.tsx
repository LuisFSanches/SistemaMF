import { CategoryContainer, Container, ContainerDivider, ContainerTitle, ProductItem, ProductsContainer } from "./style";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import appetizers from '../../assets/images/appetizers.png'
import hamburguer from '../../assets/images/hamburguer.png'
import combo from '../../assets/images/combo.png'
import drink from '../../assets/images/drink.png'
import desert from '../../assets/images/desert.png'
import beer from '../../assets/images/beer.png'

import frenchFrieProduct from '../../assets/images/french-fries-product.png'

export function ProductsPage(){
    return(
            <Container>
            <ContainerTitle>
                    <div>
                        <FontAwesomeIcon icon={faAnglesRight}/>
                        <h2>Categorias</h2>
                    </div>
                    
                </ContainerTitle>
                
                <header>
                    <CategoryContainer>
                        <img src={appetizers} alt="entradas" />
                        <div>
                            <h2>Entradas</h2>
                        </div>
                    </CategoryContainer>

                    <CategoryContainer>
                        <img src={hamburguer} alt="hamburguers" />
                        <div>
                            <h2>Hamburguers</h2>
                        </div>
                        
                    </CategoryContainer>

                    <CategoryContainer>
                        <img src={combo} alt="combos" />
                        <div>
                            <h2>Combos</h2>
                        </div>
                        
                    </CategoryContainer>

                    <CategoryContainer>
                        <img src={drink} alt="bebidas" />
                        <div>
                            <h2>Bebidas</h2>
                        </div>
                        
                    </CategoryContainer>

                    <CategoryContainer>
                        <img src={desert} alt="sobremesa" />
                        <div>
                            <h2>Sobremesas</h2>
                        </div>
                        
                    </CategoryContainer>

                    <CategoryContainer>
                        <img src={beer} alt="alcóolicas " />
                        <div>
                            <h2>Alcóolicas</h2>
                        </div>
                    </CategoryContainer>   
                </header>
                
                <ContainerDivider/>

                <ContainerTitle>
                    <div>
                        <FontAwesomeIcon icon={faAnglesRight}/>
                        <h2>Produtos</h2>
                    </div>
                    
                    <button className="add-button">
                        <FontAwesomeIcon icon={faPlus}/>
                        <p>Adicionar produto</p>
                    </button>
                </ContainerTitle>
                
                <ProductsContainer>
                    <ProductItem>
                        <div className="product-title">
                            <h3>Batata Frita P</h3>
                        </div>
                        <div className="product-description">
                            <img src={frenchFrieProduct} alt="batata frita" />
                            <p>120 gramas de batata frita</p>
                        </div>
                        <div className="product-actions">
                            <span>
                                R$10,00
                            </span>
                            <button>
                                <FontAwesomeIcon icon={faPen}  className="product-action-icon edit" />
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faTrash}  className="product-action-icon delete" />
                            </button>
                           
                        </div>
                    </ProductItem>       

                     <ProductItem>
                        <div className="product-title">
                            <h3>Batata Frita G</h3>
                        </div>
                        <div className="product-description">
                            <img src={frenchFrieProduct} alt="batata frita" />
                            <p>200 gramas de batata frita.</p>
                        </div>
                        <div className="product-actions">
                            <span>
                                R$15,00
                            </span>
                            <button>
                                <FontAwesomeIcon icon={faPen}  className="product-action-icon edit" />
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faTrash}  className="product-action-icon delete" />
                            </button>
                           
                        </div>
                    </ProductItem>

                     <ProductItem>
                        <div className="product-title">
                            <h3>Batata Frita G</h3>
                        </div>
                        <div className="product-description">
                            <img src={frenchFrieProduct} alt="batata frita" />
                            <p>200 gramas de batata frita.</p>
                        </div>
                        <div className="product-actions">
                            <span>
                                R$15,00
                            </span>
                            <button>
                                <FontAwesomeIcon icon={faPen}  className="product-action-icon edit" />
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faTrash}  className="product-action-icon delete" />
                            </button>
                           
                        </div>
                    </ProductItem>   

                     <ProductItem>
                        <div className="product-title">
                            <h3>Batata Frita G</h3>
                        </div>
                        <div className="product-description">
                            <img src={frenchFrieProduct} alt="batata frita" />
                            <p>200 gramas de batata frita.</p>
                        </div>
                        <div className="product-actions">
                            <span>
                                R$15,00
                            </span>
                            <button>
                                <FontAwesomeIcon icon={faPen}  className="product-action-icon edit" />
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faTrash}  className="product-action-icon delete" />
                            </button>
                           
                        </div>
                    </ProductItem>     
                  
                </ProductsContainer>
            </Container>
      
    )
}