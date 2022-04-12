import React, { Fragment } from 'react';
import NavBar from './NavBar';
import UserManagement from './UserManagement';
import Footer from './Footer';

const Home = () => {
    return (
        <Fragment>
            <NavBar />
            <UserManagement />
            <Footer />
        </Fragment>
    )
}

export default Home;