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
import { ErrorAlert } from "../../components/ErrorAlert";

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
    const [ errorMessage, setErrorMessage ] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IAdmin>();
    const [showLoader, setShowLoader] = useState(false);
    
    const roleValue = watch("role");

	const handleAdmin = async (formData: IAdmin) => {
        setShowLoader(true);
        setErrorMessage("");
        
        try {
            if (action === "create") {
                const { data: adminData } = await createAdmin({
                    name: formData.name,
                    username: formData.username,
                    password: formData.password,
                    role: formData.role,
                    email: formData.email,
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
                    email: formData.email,
                    super_admin_password: formData.super_admin_password
                });
                editAdmin(adminData);
                loadAvailableAdmins();
                onRequestClose();
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro ao processar operação";
            if (message === 'Invalid super admin password') {
                setErrorMessage("Senha do atual administrador inválida.");
            } else {
                setErrorMessage(message);
            }
        } finally {
            setShowLoader(false);
        }
	}

    useEffect(() => {
        setValue("name", currentAdmin.name);
        setValue("username", currentAdmin.username);
        setValue("role", currentAdmin.role);
        setValue("email", currentAdmin.email || "");
        setValue("password", "");
        setValue("super_admin_password", "");
        setErrorMessage("");
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
            {errorMessage && <ErrorAlert message={errorMessage} />}
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleAdmin)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} Vendedor</h2>
                    <Input placeholder='Nome' {...register("name", {required: "Nome inválido"})}/>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input placeholder='Usuário' {...register("username", { required: "Usuário inválido" })}/>
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    <Select {...register("role")} isEditField style={{ marginBottom: "12px" }}>
                        {Object.entries(ADMIN_ROLES).map(([key, value]) => (
                            <option key={key} value={value}>{value === "ADMIN" ? "Vendedor" : "Administrador"}</option>
                        ))}
                    </Select>

                    {roleValue === "SUPER_ADMIN" && (
                        <>
                            <Input placeholder='E-mail' type="email" {...register("email", {
                                required: roleValue === "SUPER_ADMIN" ? "E-mail obrigatório para administradores" : false,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "E-mail inválido"
                                }
                            })}/>
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        </>
                    )}

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
