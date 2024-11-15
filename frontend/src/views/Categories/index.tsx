import { Container } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";


import appetizers from '../../assets/images/appetizers.png'
import hamburguer from '../../assets/images/hamburguer.png'
import combo from '../../assets/images/combo.png'
import drink from '../../assets/images/drink.png'
import desert from '../../assets/images/desert.png'
import beer from '../../assets/images/beer.png'
import { useState } from "react";
import { NewCategoryModal } from "../../components/NewCategoryModal";

export function CategoriesPage(){

    const [isNewCategoryModalOpen, setNewCategoryModalOpen]= useState(false);

    function handleOpenNewCategoryModal(){
        setNewCategoryModalOpen(true);
    }

    function handleCloseNewCategoryModal(){
        setNewCategoryModalOpen(false);
    }

    return(
        <Container>
            <button className="add-button" onClick={handleOpenNewCategoryModal}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Nova Categoria</p>
            </button>
                <table>
                    <thead>
                        <tr>
                            <th className="table-item-id">Id</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th className="table-icon">Editar</th>
                            <th className="table-icon">Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="table-item-id">1</td>
                            <td><img src={appetizers} alt="" className="table-image" /></td>
                            <td className="category-name">Entradas</td>
                            <td className="table-icon"><button className="edit-button"> <span>Editar</span> <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"> <span>Excluir</span>  <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>

                        <tr>
                            <td className="table-item-id">2</td>
                            <td><img src={hamburguer} alt="" className="table-image" /></td>
                            <td className="category-name">Hamburguer</td>
                            <td className="table-icon"><button className="edit-button"><span>Editar</span>  <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>

                        <tr>
                            <td className="table-item-id">3</td>
                            <td><img src={combo} alt="" className="table-image" /></td>
                            <td className="category-name">Combos</td>
                            <td className="table-icon"><button className="edit-button"><span>Editar</span>  <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>

                        <tr>
                            <td className="table-item-id">4</td>
                            <td><img src={drink} alt="" className="table-image" /></td>
                            <td className="category-name">bebidas</td>
                            <td className="table-icon"><button className="edit-button"><span>Editar</span>  <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>

                        <tr>
                            <td className="table-item-id">5</td>
                            <td><img src={desert} alt="" className="table-image" /></td>
                            <td className="category-name">Sobremesa</td>
                            <td className="table-icon"><button className="edit-button"><span>Editar</span>  <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>

                        <tr>
                            <td className="table-item-id">6</td>
                            <td><img src={beer} alt=""className="table-image" /></td>
                            <td className="category-name">Cervejas</td>
                            <td className="table-icon"><button className="edit-button"><span>Editar</span>  <FontAwesomeIcon icon={faPen}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>
                    </tbody>
                </table>
                <NewCategoryModal isOpen={isNewCategoryModalOpen} onRequestClose={handleCloseNewCategoryModal} />
        </Container>         
    )

}