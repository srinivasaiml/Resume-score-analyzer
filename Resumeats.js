 // Create animated particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = Math.random() * 5 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();

        const scoreCache = {};
        let currentFileKey = null;
        let chartInstance = null;

        // Load analysis count
        const analysisCount = parseInt(localStorage.getItem('analysisCount')) || 0;
        document.getElementById('analysisCount').textContent = analysisCount;

        // File upload handling
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('resumeFile');
        const fileInfo = document.getElementById('fileInfo');
        const analyzeBtn = document.getElementById('analyzeBtn');

        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                displayFileName();
            }
        });

        fileInput.addEventListener('change', displayFileName);

        function displayFileName() {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                currentFileKey = `${file.name}-${file.lastModified}`;
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('fileSize').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                fileInfo.classList.add('show');
            }
        }

        analyzeBtn.addEventListener('click', analyzeResume);

        async function analyzeResume() {
            if (fileInput.files.length === 0) {
                alert('Please upload a resume file first!');
                return;
            }

            // Update count
            const newCount = analysisCount + 1;
            localStorage.setItem('analysisCount', newCount);
            document.getElementById('analysisCount').textContent = newCount;

            // Check cache
            if (currentFileKey && scoreCache[currentFileKey]) {
                updateUI(scoreCache[currentFileKey]);
                return;
            }

            // Show loader
            document.getElementById('loader').classList.add('show');
            document.getElementById('results').classList.remove('show');

            // Simulate analysis
            setTimeout(() => {
                const scores = {
                    Skills: Math.floor(Math.random() * 51) + 50,
                    Experience: Math.floor(Math.random() * 51) + 50,
                    Education: Math.floor(Math.random() * 51) + 50,
                    Certifications: Math.floor(Math.random() * 51) + 50,
                    Projects: Math.floor(Math.random() * 51) + 50
                };
                
                scores.Overall = Math.round(
                    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
                );

                if (currentFileKey) {
                    scoreCache[currentFileKey] = scores;
                }

                document.getElementById('loader').classList.remove('show');
                updateUI(scores);
            }, 2500);
        }

        function updateUI(scores) {
            // Display overall score
            document.getElementById('overallScore').textContent = scores.Overall;
            document.getElementById('scoreRating').textContent = getRating(scores.Overall);

            // Display category scores
            document.getElementById('skillsScore').textContent = scores.Skills;
            document.getElementById('experienceScore').textContent = scores.Experience;
            document.getElementById('educationScore').textContent = scores.Education;
            document.getElementById('certificationsScore').textContent = scores.Certifications;
            document.getElementById('projectsScore').textContent = scores.Projects;

            // Render chart
            renderChart(scores);

            // Display tips
            displayTips(scores);

            // Show results
            document.getElementById('results').classList.add('show');
            document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function getRating(score) {
            if (score >= 90) return '🌟 Outstanding!';
            if (score >= 80) return '🎯 Excellent!';
            if (score >= 70) return '👍 Good Job!';
            if (score >= 60) return '💪 Keep Improving!';
            return '📈 Room for Growth';
        }

        function renderChart(scores) {
            const ctx = document.getElementById('scoreChart').getContext('2d');
            
            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Skills', 'Experience', 'Education', 'Certifications', 'Projects'],
                    datasets: [{
                        label: 'Your Score',
                        data: [scores.Skills, scores.Experience, scores.Education, scores.Certifications, scores.Projects],
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderColor: '#667eea',
                        borderWidth: 3,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: {
                                stepSize: 20,
                                backdropColor: 'transparent'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            pointLabels: {
                                font: {
                                    size: 14,
                                    weight: '600'
                                },
                                color: '#333'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        function displayTips(scores) {
            const tips = [];
            const icons = ['💡', '🎯', '🚀', '⭐', '🔥', '✨'];
            let iconIndex = 0;

            // Overall tips
            if (scores.Overall < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Consider enhancing multiple sections of your resume for better results. Focus on quantifiable achievements and relevant keywords.'
                });
            } else if (scores.Overall >= 90) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Outstanding resume! Your profile stands out. Keep this quality consistent and consider applying to top-tier positions.'
                });
            } else {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Great foundation! A few strategic improvements can push your resume to the next level.'
                });
            }

            // Category-specific tips
            if (scores.Skills < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Add more industry-specific skills and tools relevant to your target positions. Include both technical and soft skills with proficiency levels.'
                });
            }

            if (scores.Experience < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Quantify your achievements in work experience with metrics and results. Use action verbs and highlight your impact on business outcomes.'
                });
            }

            if (scores.Education < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Include relevant coursework, academic projects, or honors. Highlight GPA if above 3.5 and any leadership roles in student organizations.'
                });
            }

            if (scores.Certifications < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Add certifications from recognized platforms like Coursera, AWS, Google, or industry-specific credentials to boost credibility.'
                });
            }

            if (scores.Projects < 70) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Describe your role and impact in projects with clear outcomes. Include links to GitHub, portfolios, or live demos where applicable.'
                });
            }

            // Advanced combination tips
            if (scores.Skills >= 85 && scores.Experience >= 85) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Your strong skills and experience make you a competitive candidate. Consider adding a compelling summary section at the top.'
                });
            }

            if (scores.Certifications >= 80) {
                tips.push({
                    icon: icons[iconIndex++ % icons.length],
                    text: 'Your certifications are impressive! Create a dedicated section to showcase them prominently and mention renewal dates if applicable.'
                });
            }

            // Render tips
            const tipsContainer = document.getElementById('tipsContainer');
            tipsContainer.innerHTML = tips.map(tip => `
                <div class="tip-item">
                    <div class="tip-icon">${tip.icon}</div>
                    <div class="tip-text">${tip.text}</div>
                </div>
            `).join('');
        }