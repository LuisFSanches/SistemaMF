import styled from 'styled-components';

interface SidebarProps {
  isMinimizedActive: boolean;
}

interface SidebarButtonProps extends SidebarProps {
  isActive: boolean;
}

/* 
 * Helper: Define a largura do Sidebar de acordo com o estado de minimização
 */
const getSidebarWidth = ({ isMinimizedActive }: SidebarProps) =>
  isMinimizedActive ? '4rem' : '30rem';

export const Container = styled.div<SidebarProps>`
  flex: 0;
  max-height: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--sideBarBackground);
  width: ${getSidebarWidth};

  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);


  transition: width 0.2s ease-in-out;

  @media (max-width: 750px) {
    align-items: center;
    width: 4rem;
  }

  @media (max-width: 550px) {
    width: 3rem;
  }
`;

export const SideBarItemContainer = styled.div`
  width: 100%;
  padding: 0.35rem 1rem;
`;

export const LogoContainer = styled.div<SidebarProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.4rem;
  background: var(--primary-color);

  .logo-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--white-background);
    display: ${({ isMinimizedActive }) => (isMinimizedActive ? 'none' : 'flex')};
  }

  img {
    width: 8rem;
    height: 5rem;
    
  }

  @media (max-width: 750px) {
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
    margin-bottom: 0;

    img {
      width: 2.3rem;
      height: 2.3rem;
    }

    p,
    .close-side-bar-menu {
      display: none;
    }
  }
`;

export const MinimizeButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .close-side-bar-menu {
    background: transparent;
    font-size: 1.5rem;
    color: var(--white-background);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 750px) {
    .close-side-bar-menu {
      display: none;
    }
  }
`;

export const SideBarButton = styled.button<SidebarButtonProps>`
  width: ${({ isMinimizedActive }) => (isMinimizedActive ? '3rem' : '15rem')};
  display: flex;
  align-items: center;
  justify-content: ${({ isMinimizedActive }) => (isMinimizedActive ? 'center' : 'flex-start')};
  color: var(--text-body);
  padding: 1rem 0.4rem;
  border-radius: 0.4rem;
  border: none;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? 'var(--white-background)' : 'transparent')};
  transition: background-color 0.2s, color 0.2s, width 0.3s;

  .Side-Bar-Icon {
    font-size: 1.6rem;
    transition: transform 0.2s;
  }

  span {
    font-size: 1.1rem;
    margin-left: 0.6rem;
    font-weight: 600;
    display: ${({ isMinimizedActive }) => (isMinimizedActive ? 'none' : 'flex')};
  }

  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? 'var(--white-background)' : 'rgba(255, 255, 255, 0.05)'};
    .Side-Bar-Icon {
      transform: scale(1.1);
    }
  }

  @media (max-width: 750px) {
    align-items: center;
    justify-content: center;
    width: 80%;
    padding: 0;
    margin-left: 0.2rem;

    span {
      display: none;
    }

    .Side-Bar-Icon {
      font-size: 1.4rem;
      padding: 0.7rem;
    }
  }
`;

export const CompanyInfoContainer = styled.div<SidebarProps>`
  width: 100%;
  display: flex;
  flex-direction: ${({ isMinimizedActive }) => (isMinimizedActive ? 'column' : 'row')};
  justify-content: space-around;
  align-items: center; /* Para ficar melhor centralizado em vários tamanhos */
  padding: 0.5rem 1rem;
  background: var(--primary-color);

  transition: flex-direction 0.3s;

  .company-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 1.1rem;
      color: var(--white-background);
      display: ${({ isMinimizedActive }) => (isMinimizedActive ? 'none' : 'flex')};
      transition: all 0.2s ease;
    }
  }

  img {
    width: ${({ isMinimizedActive }) => (isMinimizedActive ? '2.7rem' : '4rem')};
    height: ${({ isMinimizedActive }) => (isMinimizedActive ? '2.7rem' : '4rem')};
    transition: width 0.3s ease, height 0.3s ease;
  }

  .logout-icon {
    display: ${({ isMinimizedActive }) => (isMinimizedActive ? 'none' : 'flex')};
  }

  button {
    font-size: 1.25rem;
    color: var(--white-background);
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: color 0.2s;

    p {
      font-size: 1.15rem;
      margin-top: 0.3rem;
    }

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 750px) {
    flex-direction: column;

    .company-info img {
      width: 2.7rem;
      height: 2.7rem;
    }

    .company-info p,
    .logout-button .logout-icon {
      display: none;
    }

    .logout-button p {
      margin-top: 1.2rem;
    }
  }

  .custom-logout-button {
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background-color: #FF5733; 
    color: var(--white-background); 
    border: none; 
    border-radius: 5px; 
    padding: 8px 15px; 
    font-size: 14px; 
    font-weight: 500; 
    cursor: pointer; 
    transition: background-color 0.3s, transform 0.2s;
    
    &:hover {
      background-color: #f5b1c1;
      transform: scale(1.03);
    }
  }

  .custom-logout-icon {
    margin-right: 8px; 
    font-size: 20px;
  }

  .custom-logout-text {
    font-weight: bold;
  }
`;
