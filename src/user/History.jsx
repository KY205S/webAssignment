import React from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Grid } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import group13Logo from '../components/Group13-logo.jpg';

const MedicalHistory = () => {
  const [step, setStep] = useState(1);
  //Save data
  const [drinking, setDrinking] = useState("");
  const [somking, setSmoking] = useState("");
  const [neverous, setNeverous] = useState("");
  const [worrying, setWorrying] = useState("");
  const [fatigue, setFatigue] = useState("");
  const [depressed, setDepressed] = useState("");
  const [irritable, setIrritable] = useState("");
  const [insomina, setInsomina] = useState("");
  const [otherCondition, setOther] = useState("");
  const handleNext = () => {
    setStep((prevStep) => (prevStep < 2 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleOtherText = (event) => {
    setOther(event.target.value);
  };

  const [conditions, setConditions] = useState({
    asthma: false,
    diabetes: false,
    epilepsy: false,
    rheumatoidArthritis: false,
    highBloodPressure: false,
    heartDisease: false,

    heartAttack: false,
    BipolarDisorder: false,
    stroke: false,
    kidneyDisease: false,
    demenita: false,
    cancer: false,

    // Add more conditions based on your requirements...
  });

  const handleConditionChange = (event) => {
    setConditions({ ...conditions, [event.target.name]: event.target.checked });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      drinking,
      somking,
      neverous,
      worrying,
      irritable,
      depressed,
      fatigue,
      insomina,
      otherCondition,
      asthma: conditions.asthma,
      diabetes: conditions.diabetes,
      epilepsy: conditions.epilepsy,
      rheumatoidArthritis: conditions.rheumatoidArthritis,
      highBloodPressure: conditions.highBloodPressure,
      heartDisease: conditions.heartDisease,
      heartAttack: conditions.heartAttack,
      BipolarDisorder: conditions.BipolarDisorder,
      stroke: conditions.stroke,
      kidneyDisease: conditions.kidneyDisease,
      demenita: conditions.demenita,
      cancer: conditions.cancer,
    };

    // Here you can call an API or perform other actions with the formData
    console.log(formData);
    console.log("Form submitted");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box>
          {step === 1 && (
            <Box
              marginLeft={45}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                p: 2,
              }}
            >
              <Card sx={{ maxWidth: 500, width: "100%", m: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
                  Medicine History
                  </Typography>
                </Box>

                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    {[
                      {
                        name: "asthma",
                        label: "Asthma",
                      },
                      {
                        name: "diabetes",
                        label: "Diabetes ",
                      },
                      { name: "epilepsy", label: "Epilepsy" },
                      {
                        name: "rheumatoidArthritis",
                        label: "Rheumatoid Arthritis",
                      },
                      {
                        name: "highBloodPressure",
                        label: "High blood pressure",
                      },
                      {
                        name: "heartDisease",
                        label: "heart disease",
                      },
                      {
                        name: "stroke",
                        label: "Stroke",
                      },
                      {
                        name: "kidneyDisease",
                        label: "Kidney disease",
                      },
                      {
                        name: "demenita",
                        label: "Demenita",
                      },
                      {
                        name: "caner",
                        label: "Cancer",
                      },
                      {
                        name: "heartAttack",
                        label: "Heart attack",
                      },
                      {
                        name: "BipolarDisorder",
                        label: "Bipolar disorder",
                      },
                    ].map((condition) => (
                      <Grid
                        item
                        xs={12}
                        style={{ marginBottom: -16 }}
                        key={condition.name}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={conditions[condition.name]}
                              onChange={handleConditionChange}
                              name={condition.name}
                            />
                          }
                          label={condition.label}
                          sx={{ justifyContent: "space-between" }}
                          labelPlacement="start"
                        />
                      </Grid>
                    ))}

                    <TextField
                      fullWidth
                      id="firstName"
                      label="Other conditions"
                      multiline
                      rows={2}
                      variant="outlined"
                      value={otherCondition}
                      onChange={handleOtherText}
                      sx={{
                        width: "80%",
                        boxSizing: 4,
                        marginTop: 6,
                        marginLeft: 4,
                      }}
                    />
                  </Grid>

                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, width: "60%" }}
                  >
                    Next
                  </Button>

                  <Button color="primary" sx={{ mt: 1 }}>
                    Back to login
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Personal information register box */}
        <Box>
          {step === 2 && (
            <Box
              marginLeft={35}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                p: 2,
              }}
            >
              <Card sx={{ maxWidth: 500, width: "100%", m: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={group13Logo} alt="Group13 Logo" style={{maxWidth: "100px", marginTop: "20px"}}/>
                  <Typography variant="h5" component="h1" sx={{mt: 2}}>
                  Personal Information
                  </Typography>
                </Box>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Drinking Alcohol</FormLabel>
                    <RadioGroup
                      row
                      aria-label="drinking"
                      name="drinking"
                      value={drinking}
                      onChange={(e) => setDrinking(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Smoking</FormLabel>
                    <RadioGroup
                      row
                      aria-label="smoking"
                      name="smoking"
                      value={somking}
                      onChange={(e) => setSmoking(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Neverous</FormLabel>
                    <RadioGroup
                      row
                      aria-label="neverous"
                      name="neverous"
                      value={neverous}
                      onChange={(e) => setNeverous(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Worrying</FormLabel>
                    <RadioGroup
                      row
                      aria-label="worrying"
                      name="worrying"
                      value={worrying}
                      onChange={(e) => setWorrying(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Irritable</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Irritable"
                      name="Irritable"
                      value={irritable}
                      onChange={(e) => setIrritable(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Depressed</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Depressed"
                      name="Depressed"
                      value={depressed}
                      onChange={(e) => setDepressed(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Insomina</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Insominia"
                      name="Insonia"
                      value={insomina}
                      onChange={(e) => setInsomina(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    sx={{ alignSelf: "flex-start", marginLeft: 0 }}
                  >
                    <FormLabel component="legend">Fatigue</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Fatigue"
                      name="Fatigue"
                      value={fatigue}
                      onChange={(e) => setFatigue(e.target.value)}
                    >
                      <FormControlLabel
                        value="Never"
                        control={<Radio />}
                        label="Never"
                      />
                      <FormControlLabel
                        value="Sometimes"
                        control={<Radio />}
                        label="Sometimes"
                      />
                      <FormControlLabel
                        value="Often"
                        control={<Radio />}
                        label="Often"
                      />
                      <FormControlLabel
                        value="Always"
                        control={<Radio />}
                        label="Always"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 1, width: "100%" }}
                  >
                    Submit
                  </Button>

                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 0, width: "100%" }}
                  >
                    Back
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </form>
    </div>
  );
};

export default MedicalHistory;
