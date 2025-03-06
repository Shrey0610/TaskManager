// import TextField from '@mui/material/TextField';
// import Stack from '@mui/material/Stack';
// import { useState, useEffect } from 'react';
// import './App.css';
// import './index.css';
// // import { Button } from '@mui/material';

// export default function TaskSearch() {
//   const [search, setSearch] = useState('');
//   const [isVisible, setIsVisible] = useState(false);
//   const [isTyping, setIsTyping] = useState(true);
//   const [prevSearch, setPrevSearch] = useState(null);

//   // const sendquery = async (search) => {
//     // if(search.trim() !== null && search.trim() !== prevSearch) {
//     //     try {
//     //         const response = await fetch("http://localhost:5005/generate-sql", {
//     //             method: "POST",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify({ question: search }), // Wrap search in an object
//     //         });
    
//     //         const data = await response.json();
//     //         console.log("SQL Query:", data); // Handle response
//     //     } catch (error) {
//     //         console.error("Error adding search query:", error);
//     //     }
//     //   }
//     // };





    
// // useEffect((search)=>{
//   //   sendquery(search);}, [search])

// const handleBlur = () => {
//   if ( search.trim() !== prevSearch) {
//     setPrevSearch(search.trim());
//   } else {
//     setIsVisible(true);
//   }
//   // console.log(search);
// };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if ((event.metaKey && event.key === 'k')) {
//         setIsVisible(true);
//         event.preventDefault();
//         setTimeout(() => {
//           document.getElementById('search').focus();
//         }, 0);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
    
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   return (
//     <>
//       <Stack spacing={2} sx={{ width: 800 }} style={{ margin: '100px', marginBottom: '300px', marginRight: 'auto', marginLeft: 'auto' }}>
//         {isVisible ?(
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'}}>
//           <TextField
//             id="search"
//             label="Search"
//             onChange={(event) =>{ setSearch(event.target.value); setIsTyping(event.target.value.length > 0)}}
//             value={search}
//             autoFocus
//             style={{ width: '100%'}}
//             onBlur={()=> { search,()=> setIsVisible(true); setIsTyping(false)} }
//             onKeyDown={(event) => {  //when the user presses enter, the search bar will lose focus and the search value will be logged to the console:
//               if (event.key === 'Enter') {
//                 if(search.trim() !== null && search.trim() !== prevSearch) {
//                 console.log(search.trim());
//                 handleBlur(search);
//                 setIsVisible(true);
//                 // sendquery(search);
//               } else {
//                 setIsVisible(true)
//               }
//               }
//             }
//             }
//           />
//          <button 
//   style={{
//     border: 'none',
//     outline: 'none',
//     background: "transparent",
//     cursor: "pointer",
//     padding: "0px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//      margin: '0px'
//   }}  

//   onClick={()=> {if(search.trim() !== null && search.trim() !== prevSearch) {
//     console.log(search.trim());
//     handleBlur(search);
//     setIsVisible(true);
//     // sendquery(search);
//   }}}
// >
// {isTyping ? (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1}
//           stroke="currentColor"
//           className="size-6"
//           style={{ width: "40px", height: "40px", padding: "2px", margin: "0px" }}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//           />
//         </svg>
//       ) : (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="currentColor"
//           className="size-6"
//           style={{ width: "30px", height: "30px", padding: "2px", margin: "0px" }}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
//           />
//         </svg>
//       )}
// </button>

//           </div>

//         ) :  <p id='touch' onClick={()=> setIsVisible(true)} style={{ padding: '20px', border: '2px solid black', borderRadius: '10px'}} >Hit ⌘ + K <b>or</b> Click here to search </p> }
//       <p>{search}</p>
//       </Stack>

    
//     </>
//   );
// }

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import './App.css';
import './index.css';

export default function TaskSearch() {
  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [prevSearch, setPrevSearch] = useState(''); // Initialize as empty string
  // const [data, setData] = useState({ sqlQuery: '' }); // Initialize data state
  const [result, setResult] = useState({ finalResponse: '' }); // Initialize data state

  // Function to send query only if search is valid & different from previous
  //   if (!query.trim() || query.trim() === prevSearch) return;

  //   try {
  //     const response = await fetch("http://localhost:5005/generate-sql", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ question: query.trim() }),
  //     });

  //     const data = await response.json();
  //     // setPrevSearch(query.trim()); // Update previous search
  //     setData(data); // Update data state
  //     setPrevSearch(query.trim()); // Update previous search
  //   } catch (error) {
  //     console.error("Error adding search query:", error);
  //   }
  // };

  const getResult = async (query) => {
    if (!query.trim() || query.trim() === prevSearch) return;

    try {


      const response = await fetch("https://taskmanager-52vd.onrender.com/process-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const result = await response.json();
      setResult(result); // Update data state
      setPrevSearch(query.trim()); // Update previous search
    } catch (error) {
      console.error("Error adding search query:", error);
    }
  };

  // Handles when the search bar loses focus
  const handleBlur = () => {
    if (search.trim() && search.trim() !== prevSearch) {
      setPrevSearch(search.trim());
    }
    setIsVisible(true);
    setIsTyping(false);
  };

  // Handles key events
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (search.trim() && search.trim() !== prevSearch) {
        console.log(search.trim());
        // sendQuery(search);
        getResult(search);
      }
      setIsVisible(true);
    }
  };

  // Handle shortcut (⌘ + K) for opening search
  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.metaKey && event.key === 'k') {
        setIsVisible(true);
        event.preventDefault();
        setTimeout(() => {
          document.getElementById('search').focus();
        }, 0);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <Stack spacing={2} sx={{ width: 800 }} style={{ margin: '100px auto 300px' }}>
        {isVisible ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <TextField
              id="search"
              label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              autoFocus
              style={{ width: '100%' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <button
              style={{
                border: 'none',
                outline: 'none',
                background: "transparent",
                cursor: "pointer",
                padding: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: '0px'
              }}
              onClick={() => {
                if (search.trim() && search.trim() !== prevSearch) {
                  console.log(search.trim());
                  // sendQuery(search);
                  getResult(search);
                }
              }}
            >
              {isTyping ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6"
                  style={{ width: "40px", height: "40px", padding: "2px", margin: "0px" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                  style={{ width: "30px", height: "30px", padding: "2px", margin: "0px" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <p
            id="touch"
            onClick={() => setIsVisible(true)}
            style={{ padding: '20px', border: '2px solid black', borderRadius: '10px', cursor: 'pointer' }}
          >
            Hit ⌘ + K <b>or</b> Click here to search
          </p>
        )}
  {!result.finalResponse ? (

        <p style={{backgroundColor: '#fff5d9'}}><b>Query:</b> {search}</p>
  ) : (
      <>
        {/* <p style={{backgroundColor: '#ebc5c5'}}><b>AI assumed query:</b> {data.sqlQuery}</p> */}
        <p style={{backgroundColor: '#e9ffd9'}}><b>Output:</b> {result.finalResponse}</p>
      </>
        )}

      </Stack>
    </>
  );
}



// console.log(document.getElementById('free-solo-demo').value)


// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// const top100Films = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   {
//     title: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   {
//     title: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     title: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   {
//     title: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 },
//   { title: 'The Matrix', year: 1999 },
//   { title: 'Seven Samurai', year: 1954 },
//   {
//     title: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { title: 'City of God', year: 2002 },
//   { title: 'Se7en', year: 1995 },
//   { title: 'The Silence of the Lambs', year: 1991 },
//   { title: "It's a Wonderful Life", year: 1946 },
//   { title: 'Life Is Beautiful', year: 1997 },
//   { title: 'The Usual Suspects', year: 1995 },
//   { title: 'Léon: The Professional', year: 1994 },
//   { title: 'Spirited Away', year: 2001 },
//   { title: 'Saving Private Ryan', year: 1998 },
//   { title: 'Once Upon a Time in the West', year: 1968 },
//   { title: 'American History X', year: 1998 },
//   { title: 'Interstellar', year: 2014 },
//   { title: 'Casablanca', year: 1942 },
//   { title: 'City Lights', year: 1931 },
//   { title: 'Psycho', year: 1960 },
//   { title: 'The Green Mile', year: 1999 },
//   { title: 'The Intouchables', year: 2011 },
//   { title: 'Modern Times', year: 1936 },
//   { title: 'Raiders of the Lost Ark', year: 1981 },
//   { title: 'Rear Window', year: 1954 },
//   { title: 'The Pianist', year: 2002 },
//   { title: 'The Departed', year: 2006 },
//   { title: 'Terminator 2: Judgment Day', year: 1991 },
//   { title: 'Back to the Future', year: 1985 },
//   { title: 'Whiplash', year: 2014 },
//   { title: 'Gladiator', year: 2000 },
//   { title: 'Memento', year: 2000 },
//   { title: 'The Prestige', year: 2006 },
//   { title: 'The Lion King', year: 1994 },
//   { title: 'Apocalypse Now', year: 1979 },
//   { title: 'Alien', year: 1979 },
//   { title: 'Sunset Boulevard', year: 1950 },
//   {
//     title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
//     year: 1964,
//   },
//   { title: 'The Great Dictator', year: 1940 },
//   { title: 'Cinema Paradiso', year: 1988 },
//   { title: 'The Lives of Others', year: 2006 },
//   { title: 'Grave of the Fireflies', year: 1988 },
//   { title: 'Paths of Glory', year: 1957 },
//   { title: 'Django Unchained', year: 2012 },
//   { title: 'The Shining', year: 1980 },
//   { title: 'WALL·E', year: 2008 },
//   { title: 'American Beauty', year: 1999 },
//   { title: 'The Dark Knight Rises', year: 2012 },
//   { title: 'Princess Mononoke', year: 1997 },
//   { title: 'Aliens', year: 1986 },
//   { title: 'Oldboy', year: 2003 },
//   { title: 'Once Upon a Time in America', year: 1984 },
//   { title: 'Witness for the Prosecution', year: 1957 },
//   { title: 'Das Boot', year: 1981 },
//   { title: 'Citizen Kane', year: 1941 },
//   { title: 'North by Northwest', year: 1959 },
//   { title: 'Vertigo', year: 1958 },
//   {
//     title: 'Star Wars: Episode VI - Return of the Jedi',
//     year: 1983,
//   },
//   { title: 'Reservoir Dogs', year: 1992 },
//   { title: 'Braveheart', year: 1995 },
//   { title: 'M', year: 1931 },
//   { title: 'Requiem for a Dream', year: 2000 },
//   { title: 'Amélie', year: 2001 },
//   { title: 'A Clockwork Orange', year: 1971 },
//   { title: 'Like Stars on Earth', year: 2007 },
//   { title: 'Taxi Driver', year: 1976 },
//   { title: 'Lawrence of Arabia', year: 1962 },
//   { title: 'Double Indemnity', year: 1944 },
//   {
//     title: 'Eternal Sunshine of the Spotless Mind',
//     year: 2004,
//   },
//   { title: 'Amadeus', year: 1984 },
//   { title: 'To Kill a Mockingbird', year: 1962 },
//   { title: 'Toy Story 3', year: 2010 },
//   { title: 'Logan', year: 2017 },
//   { title: 'Full Metal Jacket', year: 1987 },
//   { title: 'Dangal', year: 2016 },
//   { title: 'The Sting', year: 1973 },
//   { title: '2001: A Space Odyssey', year: 1968 },
//   { title: "Singin' in the Rain", year: 1952 },
//   { title: 'Toy Story', year: 1995 },
//   { title: 'Bicycle Thieves', year: 1948 },
//   { title: 'The Kid', year: 1921 },
//   { title: 'Inglourious Basterds', year: 2009 },
//   { title: 'Snatch', year: 2000 },
//   { title: '3 Idiots', year: 2009 },
//   { title: 'Monty Python and the Holy Grail', year: 1975 },
// ];
