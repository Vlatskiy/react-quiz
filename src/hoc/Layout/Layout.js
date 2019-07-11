import React, { Component } from 'react'
import classes from './Layout.module.css'
import MenuToggle from '../../components/Navigation/MenuToggle/MenuToggle'
import Menu from '../../components/Navigation/Menu/Menu'

class Layout extends Component {

    state = {
        menu: false
    }

    toggleMenuHandler = () => {
        this.setState({
           menu:!this.state.menu 
        })
    }

    menuCloseHandler = () => {
        this.setState({
            menu:false
        })
    }

    render(){
        return (
            <div className={classes.Layout}>
                <Menu
                    isOpen={this.state.menu}
                    onClose={this.menuCloseHandler}
                />
                <MenuToggle
                    onMenuToggle={this.toggleMenuHandler}
                    isOpen={this.state.menu}
                />
                <main>
                    { this.props.children }
                </main>
            </div>
        )
    }
}

export default Layout