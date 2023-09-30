// Function to calculate risk
function calculateRisk() {
        const latitude = document.getElementById('lat-input').value;
        const longitude = document.getElementById('long-input').value;
        const riskIndexElement = document.getElementById('risk-index');
        console.log("lat is", latitude)
        // Make an HTTP request to your Node.js server
        fetch(`lat=${latitude}&long=${longitude}`)
            .then(response => response.json())
            .then(data => {
                if (data.riskIndex !== undefined) {
                    riskIndexElement.textContent = `${data.riskIndex}`;
                } else {
                    riskIndexElement.textContent = 'Data not found';
                }
            })
            .catch(error => {
                riskIndexElement.textContent = 'Error occurred';
                console.log("error", data.riskIndex)
            });
    }

    function calculatePremium() {
        var coverageSelect = document.getElementById("coverage-inr");
        var premiumSpan = document.getElementById("premium");

        var selectedCoverage = coverageSelect.value;

        if (selectedCoverage === "25000") {
            premiumSpan.textContent = "250";
        } else if (selectedCoverage === "100000") {
            premiumSpan.textContent = "500";
        } else if (selectedCoverage === "1000000") {
            premiumSpan.textContent = "2000";
        } else if (selectedCoverage === "2500000") {
            premiumSpan.textContent = "5000";
        } else if (selectedCoverage === "other") {
            var otherCoverageValue = document.getElementById("other-coverage-value").value;
            // You can add custom logic to calculate premium for the "other" option here.
            // For this example, we set it to 0.
            premiumSpan.textContent = "0";
        } else {
            premiumSpan.textContent = ""; // Clear the premium if none selected.
        }
    }

    // Call the function to initialize the map
calculatePremium();
calculateRisk();
