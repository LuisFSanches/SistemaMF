import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import {
    ModalContainer,
    Form,
    Input,
    ErrorMessage,
    Label,
    CheckboxContainer,
    Checkbox,
    Select,
    PasswordContainer
} from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { IAdmin } from "../../interfaces/IAdmin";
import { ADMIN_ROLES } from "../../constants";
import { createAdmin, updateAdmin } from "../../services/adminService";
import { useAdmins } from "../../contexts/AdminsContext";
import { Loader } from "../../components/Loader";

interface AdminModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: () => void;
    action: string;
    currentAdmin: IAdmin;
}

export function AdminModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentAdmin
}:AdminModalProps){
    const { addAdmin, editAdmin, loadAvailableAdmins } = useAdmins();
    const [ changePassword, setChangePassword ] = useState(false);
    const [ showNewPassword, setShowNewPassword ] = useState(false);
    const [ showAdminPassword, setShowAdminPassword ] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IAdmin>();
    const [showLoader, setShowLoader] = useState(false);

	const handleAdmin = async (formData: IAdmin) => {
        setShowLoader(true);
        if (action === "create") {
            const { data: adminData } = await createAdmin({
                name: formData.name,
                username: formData.username,
                password: formData.password,
                role: formData.role,
                super_admin_password: formData.super_admin_password
            });
            addAdmin(adminData);
            loadAvailableAdmins();
            onRequestClose();
        }

        if (action === "edit") {
            const { data: adminData } = await updateAdmin({
                id: currentAdmin.id,
                name: formData.name,
                username: formData.username,
                password: changePassword ? formData.password : currentAdmin.password,
                role: formData.role,
                super_admin_password: formData.super_admin_password
            });
            editAdmin(adminData);
            loadAvailableAdmins();
            onRequestClose();
        }

        setShowLoader(false);
	}

    useEffect(() => {
        setValue("name", currentAdmin.name);
        setValue("username", currentAdmin.username);
        setValue("role", currentAdmin.role);
        setValue("password", "");
        setValue("super_admin_password", "");
    }, [currentAdmin, setValue]);

	if (!currentAdmin) {
		return null;
	}

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleAdmin)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} Administrador</h2>
                    <Input placeholder='Nome' {...register("name", {required: "Nome inválido"})}/>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input placeholder='Usuário' {...register("username", { required: "Usuário inválido" })}/>
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    <Select {...register("role")} isEditField style={{ marginBottom: "12px" }}>
                        {Object.entries(ADMIN_ROLES).map(([key, value]) => (
                            <option key={key} value={value}>{value}</option>
                        ))}
                    </Select>

                    {action === "edit" &&
                        <CheckboxContainer>
                            <Checkbox type="checkbox" checked={changePassword}
                                onChange={() => setChangePassword(!changePassword)}
                            />
                            <Label>Alterar senha</Label>
                        </CheckboxContainer>
                    }

                    {(action === "create" || changePassword) &&
                        <PasswordContainer>
                            <Input type={showNewPassword ? "text" : "password"}
                                placeholder='Senha' {...register("password", { required: "Senha inválida" })}/>
                            <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash}
                                onClick={() => setShowNewPassword(!showNewPassword)}/>
                            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                        </PasswordContainer>
                    }

                    <PasswordContainer>
                        <Input type={showAdminPassword ? "text" : "password"} placeholder="Senha atual do super administrador" {...register("super_admin_password",
                            { required: "Confirmação de senha inválida" })}/>
                        <FontAwesomeIcon icon={showAdminPassword ? faEye : faEyeSlash}
                            onClick={() => setShowAdminPassword(!showAdminPassword)}/>
                        {errors.super_admin_password && <ErrorMessage>{errors.super_admin_password.message}</ErrorMessage>}
                    </PasswordContainer>

                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
