import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (!file) {
      return;
    }

    const requestParameters: AxiosRequestConfig = {
      method: "GET",
      url,
      headers: {},
      params: {
        name: encodeURIComponent(file.name),
      },
    };

    const authHeader = localStorage.getItem("authorization_token");

    if (authHeader) {
      requestParameters.headers!.Authorization = `Basic ${authHeader}`;
    }

    try {
      const response = await axios(requestParameters);

      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data.url);
  
      const result = await fetch(response.data.url, {
        method: "PUT",
        body: file,
      });
  
      console.log("Result: ", result);
  
      setFile(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

        if (response?.status === 401 || response?.status === 403) {
          alert(`Authorization error. Error code ${response.status}.`)
        } 
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
