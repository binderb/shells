// ---------------------------------
// Choose Orbital Type Multiple Choice Question
// ---------------------------------
function build_give_orbital_type_mc (quantums,flags) {
    // create prompt.
    var promptString = "What type of orbital is this?";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create orbital graph.
    $('#session_container').append('<div id="plot_area"></div>');
    generate_orbital_plot(quantums,30,'plot_area');
    $('#session_container').append('<div class="slidecontainer"><input type="range" min="0" max="10" value="0" class="slider" id="myRange" onchange="update_isovalue(this.value);"></div>');
    
    // create choices.
    var choices = [];
    //choices.push(ion.name);
    while (choices.length < 4) {
        choices.push("A");
        choices.push("B");
        choices.push("C");
        choices.push("D");
    }
    //shuffle(choices);
    for (var i=0; i<choices.length; i++) {
        $('#session_container').append('<a id="choice_'+i+'" class="mc_button" href="">'+choices[i]+'</a>');
        $('#choice_'+i).click( function(e) {
            e.preventDefault();
            if (!window.checked) {
                window.checked = true;
                if ($(this).text() == "A") {
                    $(this).css('background-color','#00a900');
                    generic_session_controller.approve();
                } else {
                    $(this).css('background-color','#9e0000');
                    generic_session_controller.incorrect(generate_feedback("---","generic"));
                }
            }
        });
    }
    $('#session_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}


// ---------------------------------
// Generate Quantum Numbers
// ---------------------------------
function generate_quantum_numbers(flags) {
    return {"n" : 4, "l" : 2, "ml" : 2, "ms" : 0.5};
}

function update_isovalue (new_isovalue) {
    Plotly.update('plot_area',{'isomax':(Math.pow(10,(10-new_isovalue)))},{},[0]);
    Plotly.update('plot_area',{'isomin':(-1*(Math.pow(10,(10-new_isovalue))))},{},[1]);
}

function generate_orbital_plot(quantums, resolution, plot_location) {
    
    var density_grid = build_wave_function(quantums,1,resolution,Math.pow(5.0,-9.5)).flat(3);
    var cartesian_space = build_cartesian_space(1,resolution,Math.pow(5.0,-9.5));
    // Translate density grid values into colors and sizes
    var isovalue = -10;
    var color_grid = zeros([resolution,resolution,resolution]).flat(3);
    var size_grid = zeros([resolution,resolution,resolution]).flat(3);
    var iso_grid_positive = zeros([resolution,resolution,resolution]).flat(3);
    var iso_grid_negative = zeros([resolution,resolution,resolution]).flat(3);
    for (var i=0;i<density_grid.length;i++) {
		d_value = density_grid[i] * Math.pow(10,isovalue);
		if (d_value > 0) iso_grid_positive[i] = d_value;
		else iso_grid_negative[i] = d_value;
		if (d_value < 0) { 
			color_grid[i] = 'rgba(255,0,0,'+Math.abs(d_value.toString())+')';
		} else color_grid[i] = 'rgba(0,0,255,'+d_value.toString()+')';
		//size_grid[i] = 8 * normalize( density_grid[i], density_max, density_min );
		
	}
    /*var trace1 = {
        x: cartesian_space[0].flat(3), //density_grid[0],
        y: cartesian_space[1].flat(3), //density_grid[1],
        z: cartesian_space[2].flat(3), //density_grid[2],
        mode: 'markers',
        marker: {
		    size: 8,
		    color: color_grid,
		    line: {
			    //color: 'rgba(217, 217, 217, 0.14)',
	    		width: 0.0 //0.5
		    },
		    opacity: 0.1
        },
        type: 'scatter3d'
    };*/
    var trace1 = {
        type: 'isosurface',
        x: cartesian_space[0].flat(3),
        y: cartesian_space[1].flat(3),
        z: cartesian_space[2].flat(3),
        value: iso_grid_positive,
        isomin: 0.2,
        isomax: 0.8,
        opacity: 0.2,
        colorscale: [
            ['0.0', 'rgba(255,0,0,0)'],
            ['1.0', 'rgba(255,0,0,1)'],
        ],
        hoverinfo: 'skip',
        hovermode: false,
        showscale: false
    }
    var trace2 = {
        type: 'isosurface',
        x: cartesian_space[0].flat(3),
        y: cartesian_space[1].flat(3),
        z: cartesian_space[2].flat(3),
        value: iso_grid_negative,
        isomin: -0.8,
        isomax: -0.2,
        opacity: 0.2,
        colorscale: [
            ['0.0', 'rgba(0,0,255,1)'],
            ['1.0', 'rgba(0,0,255,0)'],
        ],
        showscale: false
    }
    var layout = {
        xaxis: {
            showgrid: false,
            showline: false,
            zeroline: false
        },
        yaxis: {
            showgrid: false,
            showline: false,
            zeroline: false,
            gridcolor: '#FF0000',
            gridwidth: 2,
            zerolinecolor: '#0000FF',
        },
        zaxis: {
            showgrid: false,
            showline: false,
            zeroline: false
        },
        autosize: true, 
        fig_bgcolor: 'rgb(255, 255, 255)', 
        plot_bgcolor: 'rgba(0, 0, 0, 0)', 
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        hovermode: false,
        hoverinfo: 'skip'
    };
    
    var config = {responsive: true}

    var data = [trace1,trace2];

    Plotly.newPlot('plot_area', data, layout, config);
}

// ---------------------------------
// Generate Wave Function
// ---------------------------------
function build_wave_function(quantums,spatialLen,resolution,scale) {
    var spatialLen = 10.0;
    var scale = Math.pow(10.0,-9.5);
    var a0 = 5.2820 * Math.pow(10.0,-11.0);
    
    // Run initial psi calculation
    var cartesian_space = build_cartesian_space(spatialLen, resolution, scale);
    var polar_space = build_polar_space(cartesian_space[0], cartesian_space[1], cartesian_space[2], resolution);
    var initial_matrix = psi_calculation(a0, resolution, quantums.n, quantums.l, quantums.ml, polar_space.r, polar_space.theta, polar_space.phi);
    
    // Correct, normalize, and assign density matrix
    var density_matrix = zeros([resolution,resolution,resolution]);
    var avgValue = 0;
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				// Permute wavefunction when m_l < 0
				if (quantums.ml >= 0) density_matrix[i][j][k] = initial_matrix[i][j][k];
				else density_matrix[i][j][k] = initial_matrix[j][i][k];
				avgValue += density_matrix[i][j][k];
			}
		}
	}
	avgValue = avgValue / (Math.pow(resolution,3));
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				//print("wavefunction before value ("+i+","+j+","+k+"): "+density_matrix[i,j,k]);
				density_matrix[i][j][k] = density_matrix[i][j][k] / avgValue;
				//print("wavefunction after value ("+i+","+j+","+k+"): "+density_matrix[i,j,k]);
			}
		}
	}
    
    return density_matrix;
}

// ---------------------------------
// Math Functions
// ---------------------------------

function psi_calculation (a0,resolution,n,l,m,r,theta,phi) {
    var density_matrix = zeros([resolution,resolution,resolution]);
	var radial_wave_function = radial_function(a0,n,l,r,resolution);
	var angular_wave_function = angular_function(l,m,theta,phi,resolution);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				density_matrix[i][j][k] = radial_wave_function[i][j][k] * angular_wave_function[i][j][k];
			}
		}
	}
    //alert(radial_wave_function.flat(3)[0]);
    //alert(angular_wave_function.flat(3)[0]);
    return density_matrix;
    //return density_matrix;
}

function radial_function (a0,n,l,r,resolution) {
    var scalFac1 = Math.sqrt(Math.pow(2.0/(a0*n),3.0) * factorial(n-l-1.0)/(2.0*n*factorial(n+l)));
	var scalFac2 = 1.0/factorial(n-l+2.0*l);

	// Part 1: exponential component (attraction to nucleus)
	var nuclearComponent = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				nuclearComponent[i][j][k] = (2.0*r[i][j][k]/(a0*n))*(Math.exp(-r[i][j][k]/(a0*n)));
			}
		}
	}

	// Part 2: polynomial component (generates radial nodes)
	var scaledComponent = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				scaledComponent[i][j][k] = 2.0*r[i][j][k]/(a0*n);
			}
		}
	}
	var radialNodeComponent = LaguerrePolynomial(n-l-1.0,2.0*l+1.0,scaledComponent,resolution);

	// Combine components to calculate radial wave function
	var radial_wave_function = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
			    radial_wave_function[i][j][k] = nuclearComponent[i][j][k]*scalFac1*scalFac2*radialNodeComponent[i][j][k];
			}
		}
	}

	return radial_wave_function;
}

function angular_function (l, m, theta, phi, resolution) {

	if (Math.abs(m) == 2) m = -m;
	if (m == -2) {
		for (var i=0;i<resolution;i++) {
			for (var j=0;j<resolution;j++) {
				for (var k=0;k<resolution;k++) {
					phi[i][j][k] = phi[i][j][k] + Math.PI/4;
				}
			}
		}
	}

	// Normalization and scaling factors
	var normFac = Math.abs(Math.sign(m)*Math.pow(2,0.5) + (Math.sign(Math.abs(m)) - 1) * 2);
	var scalFac = Math.sqrt((2*l+1)/(4*Math.PI) * factorial(l-Math.abs(m)) / factorial(l + Math.abs(m)));

	// Add nodes to spherical harmonics functions
	var angular_wave_function = zeros([resolution, resolution, resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				var SphFn1_ijk = math.multiply(scalFac,LegendrePolynomial(l,m,Math.cos(theta[i][j][k]),resolution),math.exp(math.multiply(math.complex(0,1),m,phi[i][j][k])));
				var SphFn2_ijk = math.multiply(scalFac,LegendrePolynomial(l,-m,Math.cos(theta[i][j][k]),resolution),math.exp(math.multiply(math.complex(0,1),-m,phi[i][j][k])));
				angular_wave_function[i][j][k] = math.divide((math.add(SphFn1_ijk,SphFn2_ijk)),normFac).re;
				if (i==0 && j==0 && k==0) {
				    console.log(LegendrePolynomial(l,m,Math.cos(theta[i][j][k]),resolution));
				    console.log(math.exp(math.complex(0,1)));
				    console.log(SphFn1_ijk);
				    console.log(SphFn2_ijk);
				    console.log(angular_wave_function[i][j][k]);
				}
				//print("angular function ("+i+","+j+","+k+"): "+((SphFn1_ijk + SphFn2_ijk) / normFac));
			}
		}
	}


	return angular_wave_function;

}

function LaguerrePolynomial (n, m, r, resolution) {
	var result = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				var result_ijk = 0.0;
				for (var f=0;f<=n;f++) {
					var polynomialCoeff = factorial(m+n) * nchoosek(m+n,n-f) / factorial(f);
					result_ijk += polynomialCoeff * Math.pow(-r[i][j][k],f);
				}
				result[i][j][k] = result_ijk;
			}
		}
	}
	return result;
}

function LegendrePolynomial (l, m, x, resolution) {

	// Initiate polynomial function
	var result = 0;
	var numCoeffs = Math.floor(1/2*l - 1/2*Math.abs(m));

	// Add n coefficients to the polynomial
	for (var iterator=0;iterator<=numCoeffs;iterator++) {
		var polynomialCoeff = Math.pow(-1,iterator) * nchoosek(l-2*iterator,Math.abs(m)) * nchoosek(l,iterator) * nchoosek(2*l-2*iterator,l);
	    var exponent = l - 2*iterator - Math.abs(m);
		result = result + polynomialCoeff * Math.pow(x,exponent);
	}
    result = Math.pow(-1,m) * Math.pow(1-Math.pow(x,2),Math.abs(m)/2) * (factorial(Math.abs(m))/Math.pow(2,l)*result);
	return result;
}

/*function LegendrePolynomial (l, m, x, resolution) {

	// Initiate polynomial function
	var result = zeros([resolution,resolution,resolution]);
	var numCoeffs = Math.floor(1/2*l - 1/2*Math.abs(m));

	// Add n coefficients to the polynomial
	for (var iterator=0;iterator<=numCoeffs;iterator++) {
		var polynomialCoeff = Math.pow(-1,iterator) * nchoosek(l-2*iterator,Math.abs(m)) * nchoosek(l,iterator) * nchoosek(2*l-2*iterator,l);
	    var exponent = l - 2*iterator - Math.abs(m);
		for (var i=0;i<resolution;i++) {
			for (var j=0;j<resolution;j++) {
				for (var k=0;k<resolution;k++) {
					result[i][j][k] = result[i][j][k] + polynomialCoeff * Math.pow(x[i][j][k],exponent);
				}
			}
		}
	}
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				result[i,j,k] = Math.pow(-1,m) * Math.pow(1-Math.pow(x[i][j][k],2),Math.abs(m)/2) * factorial(Math.abs(m)/Math.pow(2,l*result[i][j][k]));
			}
		}
	}

	return result;
}*/

// ---------------------------------
// Helper Functions
// ---------------------------------

function build_polar_space (xSpace, ySpace, zSpace, resolution) {
    r = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				r[i][j][k] = Math.sqrt(Math.pow(xSpace[i][j][k],2.0)+Math.pow(ySpace[i][j][k],2.0)+Math.pow(zSpace[i][j][k],2.0));
			}
		}
	}
	theta = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				theta[i][j][k] = Math.acos(zSpace[i][j][k]/r[i][j][k]);
			}
		}
	}
	phi = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				phi[i][j][k] = Math.atan2(ySpace[i][j][k],xSpace[i][j][k]);
			}
		}
	}
	var polar_parameters = {"r" : r, "theta" : theta, "phi": phi};
	return polar_parameters;
}

function build_cartesian_space (spatialLen, resolution, scale) {
    var xRange = scaleArray(linspace(-spatialLen,spatialLen,resolution),scale);
	var yRange = scaleArray(linspace(-spatialLen,spatialLen,resolution),scale);
	var zRange = scaleArray(linspace(-spatialLen,spatialLen,resolution),scale);
	//foreach (double d in xRange) print("xRange: "+d);
	return meshgrid(xRange,yRange,zRange);
}

function flatten_array (theArray, firstIndex) {
    var flattened = [];
    var array_length = theArray[0][0][0].length;
    for (var i=0;i<array_length;i++) {
        for (var j=0;j<array_length;j++) {
            for (var k=0;k<array_length;k++) {
                flattened.push(theArray[firstIndex][k][j][i])
            }
        }
    }
    return flattened;
}

function factorial (n) {
    var factorialOfN = 1.0;
    for (var i=1;i<=n;++i) factorialOfN *= i;
    return factorialOfN;
}

function normalize (val, max, min) { 
    return (val - min) / (max - min); 
}

function nchoosek (n, k) {
	var result = factorial(n)/(factorial(n-k)*factorial(k));
	return result;
}

function scaleArray(theArray, theScale) {
	var newArray = zeros([theArray.length]);
	for (var i=0;i<theArray.length;i++) newArray[i] = theArray[i] * theScale;
	return newArray;
}

function meshgrid (xR, yR, zR) {
    var resolution = xR.length;
	var theGridx = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				theGridx[k][i][j] = xR[k];
			}
		}
	}
	var theGridy = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				theGridy[i][k][j] = yR[k];
		    }
		}
	}
	var theGridz = zeros([resolution,resolution,resolution]);
	for (var i=0;i<resolution;i++) {
		for (var j=0;j<resolution;j++) {
			for (var k=0;k<resolution;k++) {
				theGridz[i][j][k] = zR[k];
			}
		}
	}
	var theMeshGrid = [];
	theMeshGrid.push(theGridx);
	theMeshGrid.push(theGridy);
	theMeshGrid.push(theGridz);
	return theMeshGrid;
}

function linspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}