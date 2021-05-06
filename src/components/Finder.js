import React from 'react'

function Finder({ val, founds, genresList, renderMovieTitle, Autocomplete, change, search }) {
	return (
        <div className="Search" > <div className="autocomplete-wrapper"><Autocomplete
            className="Finder"
            value={val}
            items={founds}
            getItemValue={item => item.title}
            shouldItemRender={renderMovieTitle}
            renderMenu={item => (
                <div className="dropdown">
                    {item}
                </div>
            )}
            renderInput={params => (
                <input className="Inp"
                    {...params}
                    placeholder="Введіть назву фільму для пошуку"
                    margin="normal"
                    fullWidth
                />
            )}
            renderItem={(item, isHighlighted) =>
                <div className={`item ${isHighlighted ? 'selected-item' : 'itemText'}`}>
                    <span className="FilmTitle">{item.title}</span><div className="Genres"><span className="FilmGenres">Жанр: {genresList(item.genre_ids)}</span></div>
                </div>
            }
            onChange={(event, val) => change(val)}
            onSelect={val => search(val)}
        /></div></div>
	)
}

export default Finder