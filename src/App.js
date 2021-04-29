import React from 'react';
import logo from './logo.png';
import WH from './WH.png';
import RH from './RH.png';
import './App.css';
import * as axios from "axios";
import FlatList from 'flatlist-react';
import { icon } from '@fortawesome/fontawesome-svg-core';
import Star from './Star.png'
import finder from './Finder.png'
import Autocomplete from 'react-autocomplete';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            film: null,
            cdm: true,
            favorites:[],
            data: [],
            isFetching: false,
            popular: true,
            pop: true,
            fav: false,
            icon: WH,
            search: "",
            detail: false,
            over: 1,
            val: '',
            founds: [],
            genres: [],
            similar: [],
        }

    }

 


    componentDidMount() {
        if (JSON.parse(localStorage.getItem('Films')) !== null) {
            this.setState({
                favorites: JSON.parse(localStorage.getItem('Films'))
            })
        }
        else {
            this.setState({
                favorites: []
            })
        }
        console.log("ok")
        let ep ='https://api.themoviedb.org/3/movie/popular?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&page='+this.value
        axios.get(ep)
            .then((response) => {
                this.max_val=response.data.total_pages
                this.setState({
                    data: response.data.results,
                    isFetching: true
                })
                
            }).catch((err) => console.log(err))
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=48c5285ea2a448984c23e818f1beece2&language=uk')
            .then((response) => {
                this.setState({genres: response})
            })
    }
    value = 1;
    max_val = 0;
    pop_value;

    getDetails(text) {

        this.setState({
            detail: true,
            film: text,
            pop: false,
            fav: false
        })

        let ep = 'https://api.themoviedb.org/3/movie/' + text.id + '/recommendations?api_key=48c5285ea2a448984c23e818f1beece2&language=uk'
        axios.get(ep).then((response) => {
            console.log(response.data.results)
            this.setState({
                similar: response.data.results
            })
        }).catch((err) => console.log(err))
        
    }


    addToFavorites = async (film) => {
        let t = JSON.stringify(film)
        let r = JSON.stringify(this.state.favorites)
        if (r.indexOf(t) === -1) {
            console.log(film.title)
           await this.setState({
                favorites: this.state.favorites.concat(film)
            })
            localStorage.setItem('Films', JSON.stringify(this.state.favorites))
        }
        else {
            console.log("delete"+film.title)

            await this.setState({
                favorites: this.state.favorites.filter(item => JSON.stringify(item) !== JSON.stringify(film))
            })
           await console.log(this.state.favorites)
            localStorage.setItem('Films', JSON.stringify(this.state.favorites))
        }
    }

    heartIcon(film) {
        let t = JSON.stringify(film)
        let r = JSON.stringify(this.state.favorites)
        if (r.indexOf(t) === -1) {
          return  <img src={WH} className="WHeart" onClick={() => this.addToFavorites(film)} />
        }
        else {
            console.log("R"+film.title)
            return <img src={RH} className="RHeart" onClick={() => this.addToFavorites(film)} />
        }
    }

    heartIcon2(film) {
        let t = JSON.stringify(film)
        let r = JSON.stringify(this.state.favorites)
        if (r.indexOf(t) === -1) {
            return <img src={WH} className="WHeart2" onClick={() => this.addToFavorites(film)} />
        }
        else {
            console.log("R" + film.title)
            return <img src={RH} className="RHeart2" onClick={() => this.addToFavorites(film)} />
        }
    }

    ic() {
        return RH
    }
   

    count = 0;

    renderFilms = (film) => {
        this.count = this.count + 1;
        
        let path = 'http://image.tmdb.org/t/p/w500' + film.poster_path
        return <div className="FilmFrame"
            ><div>
                <img className={this.state.over != film.id ? "Poster" : "oPoster"} src={path} onClick={() => this.getDetails(film)}
                    onMouseEnter={() => this.setState({ over: film.id })}
                    onMouseLeave={() => this.setState({ over: 1 })} /></div>
            <div className="VoteStar"><img src={Star} className="Star" />
                <div className="Average"><span >{film.vote_average}</span></div>
            </div>
            <div className="Title"><span>{film.title}</span><div className="Like">{this.heartIcon(film)}</div></div>
           </div>
    }
    Favorite() {
        this.setState({ founds:[], val: '', pop: false, popular: false, fav: true, cdm: false, detail: false })
    }
    Popular() {
        this.setState({founds:[], val: '', pop: true, popular: true, fav: false, cdm: true, detail: false })
        this.componentDidMount()
    }

    genresList(genId) {
        let s=''
        for (let id in genId) {
            const item = genId[id];
            for (let idx in this.state.genres.data.genres) {
                const it = this.state.genres.data.genres[idx]
                if(it.id===item)
                s = s + it.name +", "
            }
            
        }
        let l = s.length;
        let t = s.substring(0, l-2)
        return t
    }

    change(text) {
        this.setState({ val: text })
        console.log(text)
        let s = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + text
        axios.get(s)
            .then((response) => {
                console.log(response.data.result)
                this.setState({
                    founds: response.data.results,
                    isFetching: true
                })
            }).catch((err) => console.log(err))
    }
 

    Search(e) {
        this.setState({ val: e })
        console.log()
        this.setState({ popular: true, pop: false, fav: false })
        console.log(e);
        if (e!== "") {
            let s = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + e
            axios.get(s)
                .then((response) => {
                    console.log(response.data)
                    this.setState({
                        data: response.data.results,
                        isFetching: true
                    })
                }).catch((err) => console.log(err))
        }
    }

    mainView() {
        if (this.state.detail) {
            let path = 'http://image.tmdb.org/t/p/w500' + this.state.film.poster_path
            console.log("1")
            return <div><div><div className="TitleText"><span>{this.state.film.title}</span></div>
                <div> <div className="Picture"> <img className="PictureImg" src={path} /><div className="Like2">{this.heartIcon2(this.state.film)}</div> </div><div className="Descr">
                    <div className="TextInForm1"><span className="description">Дата виходу:</span></div>
                    <div className="TextInForm1"><span className="description">Жанр:</span></div>
                </div><div className="DescrV">
                        <div className="TextInForm"><span className="descriptionValue">{this.state.film.release_date}</span></div>
                        <div className="TextInForm"><span className="descriptionValue">{this.genresList(this.state.film.genre_ids)}</span></div>
                    </div>
                </div ><div className="description2"><span >{this.state.film.overview}</span></div>
            </div><div className="SimFilms"><span >Схожі фільми:</span></div>
                <div><FlatList
                    list={this.state.similar}
                    refreshing={this.state.isFetching}
                    renderItem={this.renderFilms}
                    limit={5}
                    renderWhenEmpty={() => <div className="NoFilms"><span>Схожих фільмів не знайдено</span></div>}
                    display={{
                        grid: true,
                    }}
                /></div></div>
            
        }
        else {
            console.log("2")
            return <div><FlatList
                list={this.state.popular ? this.state.data : this.state.favorites}
                refreshing={this.state.isFetching}
                renderItem={this.renderFilms}
                renderWhenEmpty={() => <div></div>}
                display={{
                    grid: true,
                    gridGap: "20px",
                }}
            /></div>
        }
    }

    page_down() {
        if (this.value > 1)
        {
            this.value = this.value - 1;
            this.pop_value = this.value;
            this.componentDidMount()
        }
    }

    page_max_down() {
        if (this.value > 1) {
            this.value = 1;
            this.pop_value = this.value;
            this.componentDidMount()
        }
    }

    page_up() {
        if (this.value < this.max_val) {
            this.value = this.value + 1;
            this.pop_value = this.value;
            this.componentDidMount()
        }
    }

    page_max_up() {
        if (this.value < this.max_val) {
            this.value = this.max_val;
            this.pop_value = this.value;
            this.componentDidMount()
        }
    }

    pages=()=> {
        if (this.state.pop) {
            return <div className="Pages"><span className={this.value === 1 ? "Arrow" : "clArrow"} onClick={() => this.page_max_down()}>{"<<"} </span> <span className={this.value === 1 ? "Arrow" : "clArrow"} onClick={() => this.page_down()}>{"<   "}</span><span className="Value">{this.value}</span>
                <span className={this.value === this.max_val ? "Arrow" : "clArrow"} onClick={() => this.page_up()}>{">   "}</span><span className={this.value === this.max_val ? "Arrow" : "clArrow"} onClick={() => this.page_max_up()} >{">>   "}</span></div >
        }
    }

    renderMovieTitle(state, val) {
        return (
            state.title.toLowerCase().indexOf(val.toLowerCase()) !== -1
        );
    }

    render() {
  return (
    <div className="App">
      <header className="App-background">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="Filmik">
                  FILMIK-GO
        </p>
              <div className="Find">
                  
                  <form className="Form">
                      <div className="TextInForm"><span className={this.state.pop ? "Active" : "inActive"} onClick={() => this.Popular()}>Популярне</span>
                          <span className={this.state.fav ? "Active" : "inActive"} onClick={() => this.Favorite()}>Улюблені</span></div>
                      {this.pages()}
                      {this.mainView()}
                      
                  </form>
                  <div className="Fd" > <div className="autocomplete-wrapper"><Autocomplete
                      className="Finder"
                      value={this.state.val}
                      items={this.state.founds}
                      getItemValue={item => item.title}
                      shouldItemRender={this.renderMovieTitle}
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
                              <span className="FilmTitle">{item.title}</span><div className="Genres"><span className="FilmGenres">Жанр: {this.genresList(item.genre_ids)}</span></div>
                          </div>
                      }
                      onChange={(event, val) => this.change(val)}
                      onSelect={val => this.Search(val)}
                  /></div></div>
                 
        </div>

              
              

      </header>
    </div>
  );
}
}


export default App;
