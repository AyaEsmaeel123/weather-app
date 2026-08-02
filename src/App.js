import "./App.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Stack,
} from "@mui/material";

import { useTranslation } from 'react-i18next';
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
moment.locale("ar");



const theme = createTheme({
  typography: {
    fontFamily: "Harmattan",
  },
});

let cancelAxios = null;

function App() {
 
  const { t, i18n } = useTranslation();

  const [dateAndTime,setDataAndTime]=useState("");

  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale,setLocale]=useState("ar");


 function handleLanguageClick(){
    if(locale==="en"){
    setLocale("ar");
    i18n.changeLanguage("ar");
    moment.locale("ar");
    }
    else{
      setLocale("en");
    i18n.changeLanguage("en");
    moment.locale("en");
    }
    setDataAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }
 
   

  useEffect(()=>{
   i18n.changeLanguage(locale);

  },[]);


  useEffect(() => {
   
   setDataAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));

    axios

      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=27ce7b6617d12088da5ac1c48fab7ee0",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        const responseTemp = Math.round(
          response.data.main.temp - 272.15
        );

        const min = Math.round(
          response.data.main.temp_min - 272.15
        );

        const max = Math.round(
          response.data.main.temp_max - 272.15
        );

        const description =
          response.data.weather[0].description;

        const responseIcon =
          response.data.weather[0].icon;

        console.log(
          responseTemp,
          min,
          max,
          description
        );

        console.log(response.data);

        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {
      console.log("cancel");

      if (cancelAxios) {
        cancelAxios();
      }
    };
  }, []);

   const direct=locale=="ar"?"rtl":"ltr";

  return (

    

    <ThemeProvider theme={theme}>
      <Box
        sx={{
          direction: direct,
          bgcolor: "#1565c0",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Stack spacing={2}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: "#1d4fb7",
                color: "white",
                p: 3,
                borderRadius: 3,
                width: "100%",
              }}
            >
              {/* المدينة والتاريخ */}

              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="baseline"
                spacing={2}
              >
                <Typography variant="h2">
                   {t("Damascus")} 
                </Typography>

                <Typography variant="h5">
                  {dateAndTime}
                </Typography>
              </Stack>

              <Divider
                sx={{
                  my: 2,
                  bgcolor: "rgba(255,255,255,.4)",
                }}
              />

              {/* القسم الرئيسي */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                {/* معلومات الطقس */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >

                  {/* درجة الحرارة + الأيقونة */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h1">
                      {temp.number}°
                    </Typography>

                    <img
                      src={temp.icon}
                      alt="weather icon"
                    />
                  </div>

                  {/* وصف الطقس */}

                  <Typography variant="h5">
                   {t(temp.description)} 
                  </Typography>

                  {/* الصغرى + الكبرى */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h5>
                    {t("min")}: {temp.min}°
                    </h5>

                    <h5
                      style={{
                        margin: "5px",
                      }}
                    >
                      |
                    </h5>

                    <h5>
                     {t("max")}: {temp.max}°
                    </h5>
                  </div>

                </div>

                {/* الغيمة الكبيرة */}

                <div>
                  <CloudIcon
                    sx={{
                      fontSize: 200,
                    }}
                  />
                </div>

              </div>
            </Paper>

            {/* زر التحديث */}

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={handleLanguageClick}
              >
              {locale=="en"?"Arabic":"انجليزي"}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;