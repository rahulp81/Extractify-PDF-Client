
![pdfLogo](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/0a166275-dcba-4a4d-ac88-5cbde6f3a4dc)
Extractify PDF , upload PDF File and extract pages to create a new PDF.
Live Link - https://extractify-pdf-client.vercel.app/

This is the Client (FrontEnd) Repository

 Server Repository - https://github.com/rahulp81/extractify-pdf-server

<strong>Tech Stack :</strong>
React, Next JS, Express.js, Tailwind CSS, Shad cn, react-pdf, pdf-lib


## Getting Started
First, clone both this client Repo and the server Repo (Separate Folder is fine) to your  system.

<strong>For Running Client Locally (npm)  : </strong>


1 . First Install the dependancies  
```bash
npm install
```
2 .  Start the development Server :
```bash
npm run dev
```
3 .  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Now if You to want to Run/Host Server locally as well 

Clone the Server Repo - https://github.com/rahulp81/extractify-pdf-server

1 . First Install the dependancies  
```bash
npm install
```
2 .  Start the development Server (Server will start at localhost:30001) :
```bash
npm start
```

Then you will need to change api link for fetch Call in three different places inside the Frontend Codebase .

```
app/_components/Form.tsx
At Line 52 :  
 const  res  =  await  fetch('https://extractify-pdf-server-production.up.railway.app/upload', {
	method:  'POST',
	body:  formData,
	});
```	
Replace  `https://extractify-pdf-server-production.up.railway.app/upload` link with `localhost:3001/upload`

```
app/edit/[...id]/page.tsx
At Line 48:   
const  response  =  await  fetch(`https://extractify-pdf-server-production.up.railway.app/edit/${params.id}`);
```	

Replace `https://extractify-pdf-server-production.up.railway.app/edit/${params.id}` link with `localhost:3001/edit/${params.id}`  , Don't forget the `` quotes.


```
app/edit/[...id]/page.tsx
At Line 164:   
const  res  =  await  fetch(`https://extractify-pdf-server-production.up.railway.app/extract/${params.id}`, {
```	

Replace `https://extractify-pdf-server-production.up.railway.app/extract/${params.id}` link with `localhost:3001/extract/${params.id}`  , Don't forget the `` quotes.




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## App Features

<strong> Home Page </strong>

![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/947a3715-def5-46d8-877c-bdf5dcdafdff)

<strong>PDF File Selection </strong>

![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/680f7819-2df3-43e8-bb8b-4d2931a64835)

<strong> After file Upload Redirected to Edit Page</strong>
![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/5d921c1c-eaec-4bb6-981f-b0373e282f85)

<strong> Selcting Files to Extract  </strong>
![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/514a1b45-07be-4bff-affd-1b89b81cb907) 

<strong> After clicking on extract , download link will be genrated, Here you can chnage the orginal name as well and download </strong>
![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/6297cd98-a489-4e29-bc21-1372cff682f7)

<strong> Extracted PDF </strong>
![image](https://github.com/rahulp81/Extractify-PDF-Client/assets/97145237/2f45e15c-fda2-4ec6-bb56-d82cb6a85420)



















