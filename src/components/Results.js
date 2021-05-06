import React from 'react'

function Results({ pop, Popular, fav, Favorite, pages, mainView, formRef  }) {
    return (
        <form ref={formRef} className="Form">
            <div  className="TextInForm"><span className={pop ? "Active" : "inActive"} onClick={() => Popular()}>Популярне</span>
                <span className={fav ? "Active" : "inActive"} onClick={() => Favorite()}>Улюблені</span></div>
            {pages()}
            {mainView()}
            {pages()}

        </form>
    )
}

export default Results