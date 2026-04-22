import { useEffect, useState } from "react";
import "./index.css";
import countryDetails from "./data/countryDetails";

function App() {
  const [groupedCountries, setGroupedCountries] = useState({});
  const [selectedContinent, setSelectedContinent] = useState("Alles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const wantedCountries = [
    "Spain",
    "France",
    "United States",
    "Turkey",
    "Italy",
    "Mexico",
    "United Kingdom",
    "Germany",
    "Greece",
    "Japan",
    "Thailand",
    "Austria",
    "Portugal",
    "Netherlands",
    "Saudi Arabia",
    "Malaysia",
    "Morocco",
    "Hong Kong",
    "United Arab Emirates",
    "Vietnam",
    "Croatia",
    "Poland",
    "China",
    "Canada",
    "Hungary",
    "Czechia",
    "Switzerland",
    "Singapore",
    "Indonesia",
    "South Korea",
    "Dominican Republic",
    "India",
    "South Africa",
    "Sweden",
    "Belgium",
    "Ireland",
    "Egypt",
    "Tunisia",
    "Denmark",
    "Norway",
    "Finland",
    "Philippines",
    "Brazil",
    "Argentina",
    "Chile",
    "Peru",
    "Australia",
    "New Zealand",
    "Sri Lanka",
    "Jordan",
  ];

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,population,region,flags,altSpellings"
        );

        if (!response.ok) {
          throw new Error("Kon landen niet ophalen.");
        }

        const data = await response.json();

        function normalizeName(name) {
          return name
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        }

        const countryMap = new Map();

        data.forEach((country) => {
          if (country.name?.common) {
            countryMap.set(normalizeName(country.name.common), country);
          }

          if (country.name?.official) {
            countryMap.set(normalizeName(country.name.official), country);
          }

          if (country.altSpellings) {
            country.altSpellings.forEach((alt) => {
              countryMap.set(normalizeName(alt), country);
            });
          }
        });

        const aliasMap = {
          turkey: "turkiye",
          "united states": "united states",
          "south korea": "korea republic of",
          "hong kong": "hong kong",
        };

        const merged = wantedCountries
          .map((countryName) => {
            const normalizedName = normalizeName(countryName);

            const country =
              countryMap.get(normalizedName) ||
              countryMap.get(aliasMap[normalizedName] || "");

            if (!country) return null;

            const details = countryDetails[countryName] || {
              tourists: "Onbekend",
              costPerDay: "Onbekend",
              canDive: false,
              diveAnimals: [],
            };

            let region = country.region || "Overig";

            if (region === "Americas") {
              const northAmerica = [
                "United States",
                "Mexico",
                "Canada",
                "Dominican Republic",
              ];

              region = northAmerica.includes(countryName)
                ? "North America"
                : "South America";
            }

            return {
              name: countryName,
              population: country.population || 0,
              region,
              flag: country.flags?.png || country.flags?.svg || "",
              tourists: details.tourists,
              costPerDay: details.costPerDay,
              canDive: details.canDive,
              diveAnimals: details.diveAnimals,
            };
          })
          .filter(Boolean);

        const grouped = merged.reduce((acc, country) => {
          if (!acc[country.region]) {
            acc[country.region] = [];
          }

          acc[country.region].push(country);
          return acc;
        }, {});

        const continentOrder = [
          "Europe",
          "Asia",
          "Africa",
          "North America",
          "South America",
          "Oceania",
        ];

        const sortedGrouped = {};
        continentOrder.forEach((continent) => {
          if (grouped[continent]) {
            sortedGrouped[continent] = grouped[continent];
          }
        });

        setGroupedCountries(sortedGrouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  function formatMillions(number) {
    return `${Math.round(number / 1000000)} miljoen`;
  }

  const continents = ["Alles", ...Object.keys(groupedCountries)];

  const visibleContinents =
    selectedContinent === "Alles"
      ? groupedCountries
      : { [selectedContinent]: groupedCountries[selectedContinent] || [] };

  return (
    <div className="app">
      <h1 className="main-title">De 50 populairste vakantielanden</h1>
      <p className="subtitle">Per continent gegroepeerd</p>

//"De titel 'De 50 populairste vakantielanden' is heel duidelijk. 
      Misschien kun je ook nog ergens vermelden waar deze data vandaan 
      komt (welke API je gebruikt)? Dat maakt het voor de bezoeker wat 
      betrouwbaarder.GR JANINE"
      
      <div className="filter-bar">
        <label htmlFor="continent-select">Filter op continent:</label>
        <select
          id="continent-select"
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
        >
          {continents.map((continent) => (
            <option key={continent} value={continent}>
              {continent === "Alles" && "Alles"}
              {continent === "Europe" && "Europa"}
              {continent === "Asia" && "Azië"}
              {continent === "Africa" && "Afrika"}
              {continent === "North America" && "Noord-Amerika"}
              {continent === "South America" && "Zuid-Amerika"}
              {continent === "Oceania" && "Oceanië"}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="message">Laden...</p>}
      {error && <p className="message error">{error}</p>}

//"Ik zie dat je een melding 'Laden...' toont terwijl de landen worden opgehaald. 
  Misschien is het leuk om daar iets visueelds van te maken, zoals een draaiend icoontje
  of een tekst als 'Vakantiebestemmingen zoeken...'? Dat ziet er net wat professioneler 
  uit voor de gebruiker." GR JANINEE
      
      {!loading &&
        !error &&
        Object.entries(visibleContinents).map(([continent, countries]) => (
          <section key={continent} className="continent-section">
            <h1 className="continent-title">
              {continent === "Europe" && "Europa"}
              {continent === "Asia" && "Azië"}
              {continent === "Africa" && "Afrika"}
              {continent === "North America" && "Noord-Amerika"}
              {continent === "South America" && "Zuid-Amerika"}
              {continent === "Oceania" && "Oceanië"}
            </h1>

            <div className="grid">
              {countries.map((country) => (
                <article className="card" key={country.name}>
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="card-image"
                  />

                  <div className="card-content">
                    <h2>{country.name}</h2>
                    <p>
                      <strong>Inwoners:</strong>{" "}
                      {formatMillions(country.population)}
                    </p>
                    <p>
                      <strong>Toeristen:</strong> {country.tourists}
                    </p>
                    <p>
                      <strong>Kosten per dag:</strong> {country.costPerDay}
                    </p>
                    <p>
                      <strong>Duiken:</strong>{" "}
                      {country.canDive ? "Ja" : "Nee"}
                    </p>

                    {country.canDive && (
                      <p>
                        <strong>Dieren:</strong>{" "}
                        {country.diveAnimals.join(", ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}

export default App;
