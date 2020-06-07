import React from 'react';

// transoformando o componente em uma arrow function
// FC: Function Component

// title?: obrigatória
// title: não é obrigatória

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
}

export default Header;
