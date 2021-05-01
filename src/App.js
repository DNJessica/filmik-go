import React from 'react';
import logo from './components/images/logo.png';
import whiteHeart from './components/images/whiteHeart.png';
import redHeart from './components/images/redHeart.png';
import './App.css';
import * as axios from "axios";
import FlatList from 'flatlist-react';
import star from './components/images/star.png'
import Autocomplete from 'react-autocomplete';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef() 
        this.state = {
            film: null,
            cdm: true,
            favorites:[],
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
        let endpoint ='https://api.themoviedb.org/3/movie/popular?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&page='+this.value
        axios.get(endpoint)
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

        let endpoint = 'https://api.themoviedb.org/3/movie/' + text.id + '/recommendations?api_key=48c5285ea2a448984c23e818f1beece2&language=uk'
        axios.get(endpoint).then((response) => {
            this.setState({
                similar: response.data.results
            })
        }).catch((err) => console.log(err))
        
    }


    addToFavorites = async (film) => {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(this.state.favorites)
        if (favoritesJSON.indexOf(filmJSON) === -1) {
           await this.setState({
                favorites: this.state.favorites.concat(film)
            })
            localStorage.setItem('Films', JSON.stringify(this.state.favorites))
        }
        else {

            await this.setState({
                favorites: this.state.favorites.filter(item => JSON.stringify(item) !== JSON.stringify(film))
            })
            localStorage.setItem('Films', JSON.stringify(this.state.favorites))
        }
    }

    heartIcon(film) {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(this.state.favorites)
        if (favoritesJSON.indexOf(filmJSON)===-1) {
          return  <img src={whiteHeart} className="WHeart" onClick={() => this.addToFavorites(film)} />
        }
        else {
            return <img src={redHeart} className="RHeart" onClick={() => this.addToFavorites(film)} />
        }
    }

    heartIcon2(film) {
        let filmJSON = JSON.stringify(film)
        let favoritesJSON = JSON.stringify(this.state.favorites)
        if (favoritesJSON.indexOf(filmJSON)===-1) {
            return <img src={whiteHeart} className="WHeart2" onClick={() => this.addToFavorites(film)} />
        }
        else {
            return <img src={redHeart} className="RHeart2" onClick={() => this.addToFavorites(film)} />
        }
    }

    
   


    renderFilms = (film) => {
        this.count = this.count + 1;
        
        let path = 'http://image.tmdb.org/t/p/w500' + film.poster_path
        return <div className="FilmFrame"
            ><div>
                <img className={this.state.over !== film.id ? "Poster" : "oPoster"} src={path} onClick={() => this.getDetails(film)}
                    onMouseEnter={() => this.setState({ over: film.id })}
                    onMouseLeave={() => this.setState({ over: 1 })} /></div>
            <div className="VoteStar"><img src={star} className="Star" />
                <div className="Average"><span >{film.vote_average.toFixed(1)}</span></div>
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
        let genString=''
        for (let id in genId) {
            const item = genId[id];
            for (let idx in this.state.genres.data.genres) {
                const it = this.state.genres.data.genres[idx]
                if(it.id===item)
                genString = genString + it.name +", "
            }
            
        }
        let genSubstring = genString.substring(0, genString.length - 2)
        return genSubstring
    }

    change(text) {
        this.setState({ val: text })
        let endpoint = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + text
        axios.get(endpoint)
            .then((response) => {
                this.setState({
                    founds: response.data.results,
                    isFetching: true
                })
            }).catch((err) => console.log(err))
    }
 

    Search(filmName) {
        this.setState({ val: filmName })
        this.setState({ popular: true, pop: false, fav: false })
        if (filmName!== "") {
            let endpoint = 'https://api.themoviedb.org/3/search/movie?api_key=48c5285ea2a448984c23e818f1beece2&language=uk&query=' + filmName
            axios.get(endpoint)
                .then((response) => {
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
