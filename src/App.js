import React, { useEffect, useState, useRef } from "react";
import logo from './components/images/logo.png';
import whiteHeart from './components/images/whiteHeart.png';
import redHeart from './components/images/redHeart.png';
import './App.css';
import * as axios from "axios";
import FlatList from 'flatlist-react';
import star from './components/images/star.png'
import Autocomplete from 'react-autocomplete';
import Finder from './components/Finder.js'
import Results from './components/Results.js'

function App() {

    const [state, setState] = useState({
        film: null,
        cdm: true,
        favorites: [],
        data: [],
        isFetching: false,
        popular: true,
        pop: true,
        fav: false,
        search: "",
        detail: false,
        over: 1,
        val: '',
        founds: [],
        genres: [],
        similar: [],
        value : 1,
        pop_value : 1,
        max_val : 0
    });

    const formRef = useRef(null);
     useEffect (() => {
        if (JSON.parse(localStorage.getItem('Films')) !== null) {
            setState(prevState => {
                return { ...prevState, favorites: JSON.parse(localStorage.getItem('Films')) }
            })
        }
        else {
            setState(prevState => {
                return { ...prevState, favorites: [] }
            })
        }
        let endpoint = 'https://api.themoviedb.org/3/movie/popular?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&page=' + state.value
        axios.get(endpoint)
            .then((response) => {
                
                
                setState(prevState => {
                    return {
                        ...prevState, data: response.data.results, isFetching: true, max_val : response.data.total_pages }
                })

            }).catch((err) => console.log(err))
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=48c5285ea2a448984c23e818f1beece2&language=uk')
            .then((response) => {
                setState(prevState => {
                    return {
                        ...prevState, genres: response
                    }
                })
            })
    }, []);

    const refresh = (value) => {
        if (JSON.parse(localStorage.getItem('Films')) !== null) {
            setState(prevState => {
                return { ...prevState, favorites: JSON.parse(localStorage.getItem('Films')) }
            })
        }
        else {
            setState(prevState => {
                return { ...prevState, favorites: [] }
            })
        }
        let endpoint = 'https://api.themoviedb.org/3/movie/popular?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&page=' + value
        axios.get(endpoint)
            .then((response) => {


                setState(prevState => {
                    return {
                        ...prevState, data: response.data.results, isFetching: true, max_val: response.data.total_pages
                    }
                })

            }).catch((err) => console.log(err))
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=48c5285ea2a448984c23e818f1beece2&language=uk')
            .then((response) => {
                setState(prevState => {
                    return {
                        ...prevState, genres: response
                    }
                })
            })

    }



    const getDetails = (text) => {
        formRef.current.scrollTo(0, 0);
        setState(prevState => {
            return {
                ...prevState,
                detail: true,
                film: text,
                pop: false,
                fav: false
            }
        })

        let endpoint = 'https://api.themoviedb.org/3/movie/' + text.id + '/recommendations?api_key=48c5285ea2a448984c23e818f1beece2&language=uk'
        axios.get(endpoint).then((response) => {
            setState(prevState => {
                return {
                    ...prevState,  similar: response.data.results
                }
            })
        }).catch((err) => console.log(err))

    }


    const addToFavorites = async (film) => {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(state.favorites)
        if (favoritesJSON.indexOf(filmJSON) === -1) {
            localStorage.setItem('Films', JSON.stringify(state.favorites.concat(film)))
            await setState(prevState =>{ 
                return {
                    ...prevState,
                    favorites: state.favorites.concat(film)
                }
            })
            
        }
        else {
            localStorage.setItem('Films', JSON.stringify(state.favorites.filter(item => JSON.stringify(item) !== JSON.stringify(film))))

            await setState(prevState => {
                    return {
                        ...prevState,
                        favorites: state.favorites.filter(item => JSON.stringify(item) !== JSON.stringify(film))
                    }
                })
           
        }
    }

    const heartIcon = (film) => {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(state.favorites)
        if (favoritesJSON.indexOf(filmJSON) === -1) {
            return <img src={whiteHeart} className="WHeart" onClick={() => addToFavorites(film)} />
        }
        else {
            return <img src={redHeart} className="RHeart" onClick={() => addToFavorites(film)} />
        }
    }

    const heartIcon2 = (film) => {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(state.favorites)
        if (favoritesJSON.indexOf(filmJSON) === -1) {
            return <img src={whiteHeart} className="WHeart2" onClick={() => addToFavorites(film)} />
        }
        else {
            return <img src={redHeart} className="RHeart2" onClick={() => addToFavorites(film)} />
        }
    }





    const renderFilms = (film) => {

        let path = 'http://image.tmdb.org/t/p/w500' + film.poster_path
        return <div className="FilmFrame"
        ><div>
                <img className={state.over !== film.id ? "Poster" : "oPoster"} src={path} onClick={() => getDetails(film)}
                    onMouseEnter={() => setState(prevState => {
                        return { ...prevState, over: film.id }
                    })}
                    onMouseLeave={() => setState(prevState => {
                        return { ...prevState, over: 1 }
                    })} /></div>
            <div className="VoteStar"><img src={star} className="Star" />
                <div className="Average"><span >{film.vote_average.toFixed(1)}</span></div>
            </div>
            <div className="Title"><span>{film.title}</span><div className="Like">{heartIcon(film)}</div></div>
        </div>
    }
    const Favorite = () => {
        setState(prevState => {
            return { ...prevState, founds: [], val: '', pop: false, popular: false, fav: true, cdm: false, detail: false }
        })
    }
    const Popular = () => {
        refresh(state.value)
        setState(prevState => {
            return { ...prevState, founds: [], val: '', pop: true, popular: true, fav: false, cdm: true, detail: false }
        })
        
    }

    const genresList = (genId) => {
        let genString = ''
        for (let id in genId) {
            const item = genId[id];
            for (let idx in state.genres.data.genres) {
                const it = state.genres.data.genres[idx]
                if (it.id === item)
                    genString = genString + it.name + ", "
            }

        }
        let genSubstring = genString.substring(0, genString.length - 2)
        return genSubstring
    }

    const change = (text) => {
        setState(prevState => {
            return { ...prevState, val: text }
        })
        let endpoint = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + text
        axios.get(endpoint)
            .then((response) => {
                setState(prevState => {
                    return {
                        ...prevState, founds: response.data.results,
                        isFetching: true }
                })
            }).catch((err) => console.log(err))
    }


    const search = (filmName) => {
        setState(prevState => {
            return { ...prevState, val: filmName, popular: true, pop: false, fav: false, detail: false }
        })
        if (filmName !== "") {
            let endpoint = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + filmName
            axios.get(endpoint)
                .then((response) => {
                    setState(prevState => {
                        return {
                            ...prevState, data: response.data.results,
                            isFetching: true
                        }
                    })
                }).catch((err) => console.log(err))
        }
    }

    const mainView = () => {
        if (state.detail) {
            let path = 'http://image.tmdb.org/t/p/w500' + state.film.poster_path
            return <div><div><div className="TitleText"><span>{state.film.title}</span></div>
                <div> <div className="Picture"> <img className="PictureImg" src={path} /><div className="Like2">{heartIcon2(state.film)}</div> </div><div className="Descr">
                    <div className="TextInForm1"><span className="description">Дата виходу:</span></div>
                    <div className="TextInForm1"><span className="description">Жанр:</span></div>
                </div><div className="DescrV">
                        <div className="TextInForm"><span className="descriptionValue">{state.film.release_date}</span></div>
                        <div className="TextInForm"><span className="descriptionValue">{genresList(state.film.genre_ids)}</span></div>
                    </div>
                </div ><div className="description2"><span >{state.film.overview}</span></div>
            </div><div className="SimFilms"><span >Схожі фільми:</span></div>
                <div><FlatList
                    list={state.similar}
                    refreshing={state.isFetching}
                    renderItem={renderFilms}
                    limit={5}
                    renderWhenEmpty={() => <div className="NoFilms"><span>Схожих фільмів не знайдено</span></div>}
                    display={{
                        grid: true,
                    }}
                /></div></div>

        }
        else {
            return <div><FlatList
                list={state.popular ? state.data : state.favorites}
                refreshing={state.isFetching}
                renderItem={renderFilms}
                renderWhenEmpty={() => <div></div>}
                display={{
                    grid: true,
                    gridGap: "20px",
                }}
            /></div>
        }
    }

    const page_down = async() => {
        if (state.value > 1) {
            refresh(state.value - 1) 
           await setState(prevState => {
                return {
                    ...prevState, value: (state.value - 1), pop_value: (state.value - 1)
                }
            })
        }
    }

    const page_max_down = async() => {
        if (state.value > 1) {
            refresh( 1) 
           await setState(prevState => {
                return {
                    ...prevState, value: 1, pop_value: 1
                }
            })
        }
    }

    const page_up = async() => {
        if (state.value < state.max_val) {
            refresh(state.value+1) 
      await   setState(prevState => {
                return {
                    ...prevState, value: (prevState.value + 1), pop_value: (prevState.value + 1)
               }
               
         })
              
        }
    }

    const page_max_up = async() => {
        if (state.value < state.max_val) {
            refresh(state.max_val) 
           await setState(prevState => {
                return {
                    ...prevState, value: state.max_val, pop_value: state.max_val
                }
           })
        }
    }

    const pages = () => {
        if (state.pop) {
            return <div className="Pages"><span className={state.value === 1 ? "Arrow" : "clArrow"} onClick={() => page_max_down()}>{"<<"} </span> <span className={state.value === 1 ? "Arrow" : "clArrow"} onClick={() => page_down()}>{"<   "}</span><span className="Value">{state.value}</span>
                <span className={state.value === state.max_val ? "Arrow" : "clArrow"} onClick={() => page_up()}>{">   "}</span><span className={state.value === state.max_val ? "Arrow" : "clArrow"} onClick={() => page_max_up()} >{">>   "}</span></div >
        }
    }

    const renderMovieTitle = (state, val) => {
        return (
            state.title.toLowerCase().indexOf(val.toLowerCase()) !== -1
        );
    }


    return (
        <div className="App">
            <header className="App-background">
                <img src={logo} className="App-logo" alt="logo" />
                <p className="Filmik">
                    FILMIK-GO
        </p>
                <div className="Find">

                    <Results  pop={state.pop} Popular={Popular} fav={state.fav} Favorite={Favorite} pages={pages} mainView={mainView} formRef={formRef} />
                    
                    <Finder val={state.val} founds={state.founds} genresList={genresList} renderMovieTitle={renderMovieTitle} Autocomplete={Autocomplete}
                    change = { change } search = { search } />


                </div>




            </header>
        </div>
    );

}



export default App;
