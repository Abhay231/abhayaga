let apiUrl = 'https://api.recruitcrm.io/v1/jobs/search';
const apiToken = '7ph7atKWpBgK5rQQDbd1alptL2UiQ1vusYTB8hb8B6UP7bLKmb2qt3HRjScQa9nunJuI5cdhpqU0kyVrzHm5TF8xNjk3MDMyNDU2';


    function search() {
        const selectedJob = document.getElementById('job-search').value;
        const selectedCountry = document.getElementById('choose-country').value;
       
        const selectedKeyword = document.getElementById('keywordInput').value;
        console.log(selectedJob,selectedCountry,selectedKeyword);

        
        if(selectedJob=="" && selectedCountry=="" && selectedKeyword=="" ){
            noFilterJob();
        }
        else{
            const searchData = {
                country:selectedCountry,
                job:selectedJob,
                namedata:selectedKeyword
                
            };
            setTimeout(() => {
                fetchFilteredData(searchData);
            }, 2000);
        }

        
    }
    async function fetchFilteredData(searchData) {
        const {country,job,namedata} =searchData
        
        const apiEndpoint = `${apiUrl}?country=${country}&job_category=${job}&name=${namedata}`;

        showLoadingSpinner();

        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiToken,
                    'Content-Type': 'application/json'
                },
            });
            console.log(response)
            const data = await response.json();
            console.log(data);

            if (data && data.data && data.data.length > 0) {
                renderJobCards(data.data, currentPage);
                renderPagination(data.data.length);
            }
            else{
                console.log('No jobs found. API Response:', data);
                const jobContainer = document.querySelector('.job-openings');
                jobContainer.innerHTML = '<h2>NO JOB FOUND</h2>';
                const paginationContainer = document.getElementById('pagination');
                paginationContainer.innerHTML = '';
                
            }
            
        } catch (error) {

            console.error('Error fetching filtered data:', error);
        }
        finally 
        {
            
            hideLoadingSpinner();
        }
    }
    
    const getPost = async () => {
        try {
            const response = await fetch("https://api.recruitcrm.io/v1/jobs", {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiToken,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
    
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const displayOptions = async () => {
        const selectedC = document.getElementById('choose-country');
        const options = await getPost();
        const uniqueCities = new Set();
        if (options && options.data) {
            options.data.forEach(option => {
                uniqueCities.add(option.country);
                
            });
        } else {

            console.error('No data available');
        }
        uniqueCities.forEach(value=>{
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.text = value;
            selectedC.appendChild(newOption);
        });
    };
    
    displayOptions();
    const displayOption = async () => {
        const selectedj = document.getElementById('job-search');
        const options2 = await getPost();
        const uniqueCategory = new Set();
        if (options2 && options2.data) {
            options2.data.forEach(option => {
                uniqueCategory.add(option.job_category);
                
            });
        } else {
            
            console.error('No data available');
        }
        uniqueCategory.forEach(value=> {
                const newOption = document.createElement("option");
                newOption.value =value;
                newOption.text = value;
                selectedj.appendChild(newOption);
        })
    };
    
    displayOption();
    
    const jobsPerPage = 9;
    let currentPage = 1;

    function toggleMobileMenu() {
        var navbar = document.getElementById("navbar");
        navbar.classList.toggle("nav-active");
    }

    const loadingSpinner = document.getElementById('loadingSpinner');
    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }
    

    

    function renderPagination(totalJobs) {
        const totalPages = Math.ceil(totalJobs / jobsPerPage);
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
    
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                search();
            }
        });
    
        paginationContainer.appendChild(prevButton);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                search();
            });
    
            paginationContainer.appendChild(pageButton);
        }
    
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                search();
            }
        });
    
        paginationContainer.appendChild(nextButton);
    }
    
      function renderJobCards(jobs,page) {

        const jobContainer = document.querySelector('.job-openings');
        jobContainer.innerHTML = '';

        if (jobs.length === 0) {
            // Display "No Jobs Found" message
            const noJobsCard = document.createElement('div');
            noJobsCard.classList.add( 'no-jobs-found');
            noJobsCard.innerHTML = '<h2>No Jobs Found</h2>';
            jobContainer.appendChild(noJobsCard);
            return;
        }
        const startIndex = (page - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const currentJobs = jobs.slice(startIndex, endIndex);
        console.log(currentJobs);
        currentJobs.forEach(job => {

            const jobCard = document.createElement('div');
            jobCard.value=job.job_slug;
            jobCard.classList.add('job-card');
            jobCard.innerHTML = `
                 <img src="${job.shared_job_image}" alt="${job.job_type} Icon">
            <h2>${job.name}</h2>
            <p>Location: ${job.city}</p>
            <!-- Additional information -->
            <p>Country: ${job.country}</p>
            <p>Category: ${job.job_category}</p>
            <p>Category: ${job.city}</p>

            
            <button class="custom-btn btn-7" ><a href="details.html?job_slug=${job.slug}">Apply</a></button>
            


            
        `;
        

            jobContainer.appendChild(jobCard);
        });

    }
    
    

    function showModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
      
        
        window.onclick = function(event) {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        };
      
        
        const closeButton = document.querySelector('.close');
        closeButton.onclick = function() {
          modal.style.display = 'none';
        };
    }

      
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', search);

    async function noFilterJob(){
        const apiEnd = 'https://api.recruitcrm.io/v1/jobs';

        try {
            showLoadingSpinner();
            const jobContainer = document.querySelector('.job-openings');
        jobContainer.style.display = 'none';
            const response = await fetch(apiEnd, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiToken,
                    'Content-Type': 'application/json'
                },
            });
            console.log(response)
            const data = await response.json();
            console.log(data);

            if (data && data.data) {
                renderJobCards(data.data,currentPage);
                renderPagination(data.data.length);
                jobContainer.style.display = 'block';
            } 
            else{

                const jobContainer = document.querySelector('.job-openings');
                jobContainer.innerHTML = '<h2>NO JOB FOUND</h2>';
                const paginationContainer = document.getElementById('pagination');
                paginationContainer.innerHTML = '';
            }
            
        } catch (error) {

            console.error('Error fetching filtered data:', error);
        }
        finally {
            // Hide loading spinner after data is fetched
            hideLoadingSpinner();
        }
    }

    window.onload=noFilterJob();
    VanillaTilt.init(document.querySelector(".box"), {
		max: 20,
		speed: 400,
    glare: true,
    transition: true,
    reverse: true,
    
	});