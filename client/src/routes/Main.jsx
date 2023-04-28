import React from 'react'
import Header from '../features/header/Header'
import EntriesList from '../features/ratings/EntriesList'

const Main = () => {
    return (
        <div className="App">
            <Header />
            <EntriesList />
        </div>
    )
}

export default Main