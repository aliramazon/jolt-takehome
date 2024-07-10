/**
 *	While the template uses a functional component, you are free
 *	to use either functional or class-based components for this
 *	question. Please organize your components neatly; as long as
 *  `StarWarsPlanets` is the root component it should work just
 *	fine. Follow the steps below to complete the question. It is
 *	recommended that you save your work to a note pad after each
 *	step to be safe.
 *
 *	We have added an alias for `react-native` which uses
 *	`react-native-web` under the hood. You may write your solution
 *	in either React Native or React Web syntax; we just ask that
 *	you stay consistent.
 *
 *	Step 1 - Fetch data
 *		For this you will use the SWAPI API to request a list
 *		of planets. You can find info about the API at the
 *		following URL: `https://swapi.dev/documentation`
 *		You may either use Axios or Fetch to load the data. There
 *		should be some sort of indicator while loading data; even
 *		something as simple as the text "loading...".
 *
 *		NOTE: pay attention to the trailing slash on the URL for
 *					your API requests. Omitting it will cause a redirect
 *					that may cause CORS errors depending on your browser.
 *
 *	Step 2 - Render the results
 *		You can style the list however you like, but please render
 *		the results in a vertical list of cards that contain a brief
 *		summary of the planet.
 *
 *	Step 3 - Handle press
 *		When pressing/clicking an item, it should open a page with
 *		more details about the planet. The page should also have a
 *		button to navigate back. Navigation state should be managed
 *		via React state for simplicity. For example:
 *
 *		```
 *		if (this.state.selectedPlanetId) {
 *			return <PlanetDetails />;
 *		} else {
 *			return <PlanetsList />;
 *		}
 *		```
 *
 *	Step 4 - Load more
 * 		At the bottom of the list should be a button to load more
 *    results.
 *
 *  Optional Challenge
 *    When scrolled to the bottom of the list it should fetch the
 *		next set of results and append them. Nothing should happen
 *		to the already loaded results. Once there is no more data to
 *		load it should display "End of list" at the bottom.
 *
 *	Done! - Go ahead and submit your solution
 *
 */
import React, { useEffect, useState } from "react";

class SWAPI {
    constructor() {
        this.baseUrl = "https://swapi.dev/api";
    }

    async getPlanets(pageNumber) {
        try {
            const response = await fetch(
                `${this.baseUrl}/planets/?page=${pageNumber}`
            );
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }
}

const swapiApi = new SWAPI();

const parseIdFromURL = (url) => {
    //  "https://swapi.dev/api/planets/2/";

    const parts = url.split("/");
    const id = parts[parts.length - 2];
    return id;
};

const parsePageNumberFromURL = (url) => {
    // https://swapi.dev/api/planets/?page=2;
    const parts = url.split("?page=");
    const pageNumber = parts[parts.length - 1];
    return pageNumber;
};

const Planets = ({ data, onClick }) => {
    return (
        <>
            {data.map((planet) => {
                return (
                    <div
                        style={{
                            border: "1px solid black",
                            borderRadius: "5px",
                            padding: "5px",
                            marginBottom: "20px",
                        }}
                        onClick={() => onClick(planet.id)}
                    >
                        <h1>{planet.name}</h1>
                        <p>{planet.population}</p>
                    </div>
                );
            })}
        </>
    );
};

const PlanetPage = ({ data, goBack }) => {
    return (
        <div
            style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                marginBottom: "20px",
            }}
        >
            {" "}
            <button onClick={goBack}>Go Back</button>
            <h1>Name: {data.name}</h1>
            <p>Population: {data.population}</p>
            <p>Rotation Period: {data.rotation_period}</p>
            <p>Orbital Period: {data.orbital_period}</p>
            <p>Climate: {data.climate}</p>
            <p>Gravity: {data.gravity}</p>
        </div>
    );
};

const StarWarsPlanets = (props) => {
    const [fetching, setFetching] = useState(false);
    const [activePlanetId, setActivePlanetId] = useState("");
    const [planets, setPlanets] = useState({});
    const [nextPage, setNextPage] = useState(1);

    useEffect(() => {
        setFetching(true);
        swapiApi
            .getPlanets(nextPage)
            .then((data) => {
                if (data.next) {
                    setNextPage(parsePageNumberFromURL(data.next));
                } else {
                    setNextPage(null);
                }
                setPlanets((prevPlanets) => {
                    const copy = { ...prevPlanets };
                    data.results.forEach((planet) => {
                        const planetId = parseIdFromURL(planet.url);
                        copy[planetId] = planet;
                        copy[planetId].id = planetId;
                    });

                    return copy;
                });
                setFetching(false);
            })
            .catch((err) => {
                console.log(err);
                setFetching(false);
            });
    }, []);

    const fetchMore = () => {
        swapiApi
            .getPlanets(nextPage)
            .then((data) => {
                if (data.next) {
                    setNextPage(parsePageNumberFromURL(data.next));
                } else {
                    setNextPage(null);
                }
                setPlanets((prevPlanets) => {
                    const copy = { ...prevPlanets };
                    data.results.forEach((planet) => {
                        const planetId = parseIdFromURL(planet.url);
                        copy[planetId] = planet;
                        copy[planetId].id = planetId;
                    });

                    return copy;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectPlanet = (id) => {
        setActivePlanetId(id);
    };

    const goBack = () => {
        setActivePlanetId("");
    };
    if (fetching) return <div>...Loading</div>;

    const planetsArr = Object.values(planets);
    return (
        <div>
            {activePlanetId ? (
                <PlanetPage data={planets[activePlanetId]} goBack={goBack} />
            ) : (
                <Planets data={planetsArr} onClick={selectPlanet} />
            )}
            {nextPage && <button onClick={fetchMore}>Fetch More</button>}
        </div>
    );
};

/* isAnagram */
// DO not consider spaces

/*
 * Implement an optimized algorithm for determining whether
 * the provided matrix includes the target value. The provided
 * matrix can be expected to be sorted such that values are
 * increasing left to right, and rows are increasing from top
 * to bottom.
 *
 * e.g. [[1,2,3], [4,5,6], [7,8,9]]
 */
function searchMatrix(matrix, targetValue) {
    // code here
}
