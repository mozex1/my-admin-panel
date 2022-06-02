import React from "react"

const Spinner = ({ active }) => {
    return (
        <div className={active ? 'wrapper_spinner active' : 'wrapper_spinner'}>
            <div className={active ? 'spinner active' : 'spinner'}>
                <div className='container'>
                    <div className='block'>
                        <div className='item'></div>
                        <div className='item'></div>
                        <div className='item'></div>
                        <div className='item'></div>
                    </div>
                </div>
                <div className='container'>
                    <div className='block'>
                        <div className='item'></div>
                        <div className='item'></div>
                        <div className='item'></div>
                        <div className='item'></div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Spinner;