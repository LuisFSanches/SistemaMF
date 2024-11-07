import { Container, OrderCard} from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight, faPrint } from "@fortawesome/free-solid-svg-icons";

export function ServiceOrdersPage(){
    return(
            <Container>
              <div className="order-container">
                  <header className="opened-order">
                      Aberto
                  </header>
                  <OrderCard className="opened">
                      <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                                <li>1x Brownie</li>
                                <li>1x Petit Gateu</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                            <p>Brownie sem calda</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-production">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Produção</p>
                          </button>
                      </div>

                  </OrderCard>

                  <OrderCard className="opened">
                      <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                                <li>1x Brownie</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-production">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Produção</p>
                          </button>
                      </div>

                  </OrderCard>

                  <OrderCard className="opened">
                      <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-production">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Produção</p>
                          </button>
                      </div>

                  </OrderCard>

              </div>
              <div className="order-container ">
                    <header className="being-made-order">
                      Em Produção
                    </header>
                    <OrderCard className="being-made">
                                 <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-finished">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Finalizado</p>
                          </button>
                      </div>
                    </OrderCard>

                    <OrderCard className="being-made">
                                 <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-finished">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Finalizado</p>
                          </button>
                      </div>
                    </OrderCard>

                    <OrderCard className="being-made">
                                 <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="to-finished">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Finalizado</p>
                          </button>
                      </div>
                    </OrderCard>
              </div>
              <div className="order-container">
                    <header className="finished-order">
                     Finalizado
                    </header>

                    <OrderCard className="finished">
                                 <div className="order-number">
                        <h2>Pedido #220401</h2>
                      </div>
                      
                      <div className="order-info">
                        <h2>Mesa 02</h2>
                        <div className="order-time">
                            <h3>Hora do Pedido: 19:07</h3>
                            <p>10 minutos atrás</p>
                        </div>
                      </div>
                      <div className="client-info">
                          <h3>Cliente: </h3>
                          <h3> José</h3>
                      </div>
                      <div className="order-content">
                          <div className="order-itens">
                            <h3>Descrição do pedido</h3>
                            <ul>
                                <li>1x Batata frita P</li>
                                <li>1x Coca cola lata</li>
                                <li>1x Hamburguer</li>
                                <li>1x Chopp de vinho</li>
                            </ul>
                          </div>
                          
                          <div className="order-observation">
                            <h3>Observações:</h3>
                            <p>Tirar a salada do lanche</p>
                          </div>
                      </div>
                    
                      <div className="order-actions">
                          <button className="print"> 
                                <FontAwesomeIcon icon={faPrint}/>
                                <p>Imprimir</p>
                          </button>

                          <button className="delivered">
                              <FontAwesomeIcon icon={faAnglesRight}/>
                              <p>Entregue</p>
                          </button>
                      </div>
                    </OrderCard>
              </div>
            </Container>
    )
}