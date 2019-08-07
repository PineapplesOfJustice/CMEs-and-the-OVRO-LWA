/* Global Variables */

// For Mobile v. Desktop Features //
var mobileCutoff = 1000;
var isMobile = false;

// For Sun Carousel
var sunArray = {
    visible: [],
    radio: [],
}

var initialLoadSpecification = {
    visible: {
        loadAmount: 100,
        preferredSliderMaxValue: 47, // 48 hours - 1 || 240 -1 for 12 minutes intervals 
        loadTimeAdjust: 1,
        stepSize: {
            amount: 1,
            type: "hour",
        }
    },
    radio: {
        loadAmount: 100,
        preferredSliderMaxValue: 47, // 48 hours - 1 || 288 -1 for 10 minutes intervals 
        loadTimeAdjust: 1,
        stepSize: {
            amount: 1,
            type: "hour",
        }
    },
}

var sunArrayObjectLoaded = {
    visible: -1,
    radio: -1,
}

var sunObject = {
    visible: {
        carousel: document.getElementById("visibleSunCarousel"),
        carouselFilter: document.getElementById("visibleSunCarouselFilter"),
        carouselSlider: document.getElementById("visibleSunCarouselSlider"),
        carouselSliderContainer: document.getElementById("visibleSunCarouselSliderContainer"),
        carouselDate: document.getElementById("visibleSunDate"),
    },
    radio: {
        carousel: document.getElementById("radioSunCarousel"),
        carouselFilter: document.getElementById("radioSunCarouselFilter"),
        carouselSlider: document.getElementById("radioSunCarouselSlider"),
        carouselSliderContainer: document.getElementById("radioSunCarouselSliderContainer"),
        carouselDate: document.getElementById("radioSunDate"),
    },
};

for(var type in sunObject) {
    sunObject[type].carouselSlider.max = initialLoadSpecification[type].preferredSliderMaxValue;
    sunObject[type].carouselSlider.value = initialLoadSpecification[type].preferredSliderMaxValue;
}

// Predefined Values
var dayToMilliSec = 8.64 * Math.pow(10, 7);
var hourToMilliSec = 3.6 * Math.pow(10, 6);

var monthArray = [
    {
        name: "January",
        abbreviation: "Jan",
        day: 31,
    },
    {
        name: "February",
        abbreviation: "Feb",
        day: 28,
        setDay: function(year) {
            if (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) {
                this.day = 29;
            }
            else {
                this.day = 28;
            }
        }
    },
    {
        name: "March",
        abbreviation: "Mar",
        day: 31,
    },
    {
        name: "April",
        abbreviation: "Apr",
        day: 30,
    },
    {
        name: "May",
        abbreviation: "May",
        day: 31,
    },
    {
        name: "June",
        abbreviation: "Jun",
        day: 30,
    },
    {
        name: "July",
        abbreviation: "Jul",
        day: 31,
    },
    {
        name: "August",
        abbreviation: "Aug",
        day: 31,
    },
    {
        name: "September",
        abbreviation: "Sep",
        day: 30,
    },
    {
        name: "October",
        abbreviation: "Oct",
        day: 31,
    },
    {
        name: "November",
        abbreviation: "Nov",
        day: 30,
    },
    {
        name: "December",
        abbreviation: "Dec",
        day: 31,
    },];

// For Update Button: Timer to Next Hour //
var sunArrayUpdateButton = document.getElementById("updateButton");
var waitTimeAdjust = 200;

// For Navigation Bar: Smooth Scroll //
var scrollTimeAdjust = 1.5;
var scrollTimeMax = 1000;
var scrollPositionAdjust = 50;

// For  Navigation Bar: Hide Navbar //
var navBar = document.getElementById("navBar");
var crossHereToHideNavBar = document.getElementById("crossHereToHideNavBar");
var oldScrollPosition = window.pageYOffset;
var minimumOffsetForHide = crossHereToHideNavBar.offsetTop /* - scrollPositionAdjust */ - navBar.offsetHeight;
var forcedHideNavBar = false;

// For  Navigation Bar: Locator //
var navBarLocator = document.getElementById("navBarLocator");
var navBarLocatorArrow = document.getElementById("navBarLocatorArrow");


/* Initiate Website */

initiateWebsite();
function initiateWebsite() {
    
    for (var type in sunObject) {
        var currentSunArray = sunArray[type];
        var currentCarousel = sunObject[type].carousel;
        var currentCarouselFilter = sunObject[type].carouselFilter;
        var currentCarouselSlider = sunObject[type].carouselSlider;
        var currentCarouselDate = sunObject[type].carouselDate;
        
        var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
        var currentSunArrayInitialLoadAmount = initialLoadSpecification[type].loadAmount;
        var currentLoadTimeAdjust = initialLoadSpecification[type].loadTimeAdjust;
        var currentStepSizeAmount = initialLoadSpecification[type].stepSize.amount;
        var currentStepSizeType = initialLoadSpecification[type].stepSize.type;
        
        var currentDate = new Date();
        var formattedDate = formatDate((Math.floor(currentDate/hourToMilliSec) - currentLoadTimeAdjust)*hourToMilliSec);
        
        for (var repeat = 0; repeat < currentSunArrayInitialLoadAmount; repeat++) {
            currentSunArray.push(dateToSunArrayObject(formattedDate, type));
            formattedDate = subtractTime(currentStepSizeAmount, currentStepSizeType, formattedDate);
        }

        currentCarousel.setAttribute("src", "Assets/Images/Visual Sun Placeholder/" + capitalize(type) + ".jpg");
        currentCarouselFilter.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
        currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;
    }
    
    setUpdateTimer(getMilliSecToNextHour());
    
    isMobile = false;
    if(window.innerWidth <= mobileCutoff || document.body.clientWidth <= mobileCutoff) {
        isMobile = true;
    }
    
    if(isMobile) {
        navBar.addEventListener("webkitTransitionEnd", relocateNavBarLocator);
        navBar.addEventListener("transitionend", relocateNavBarLocator);
    }
    
    console.clear();
    console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
}


/* Re-Position Carousel Slider */ 

window.onresize = function() {
    for(var type in sunObject) {
        var currentCarousel = sunObject[type].carousel;
        var currentCarouselSliderContainer = sunObject[type].carouselSliderContainer;
        
        var offsetX = currentCarousel.offsetLeft - currentCarouselSliderContainer.offsetLeft - 10;
        var offsetY = currentCarousel.offsetTop - currentCarouselSliderContainer.offsetTop;
        var carouselSize = currentCarousel.offsetWidth;
        var sliderSize = 200;
        //currentCarouselSliderContainer.style.transform = "translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px)";
        currentCarouselSliderContainer.setAttribute("style", "-webkit-transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px); transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px);");
    }
       
    oldScrollPosition = window.pageYOffset;
    minimumOffsetForHide = crossHereToHideNavBar.offsetTop /* - scrollPositionAdjust */ - navBar.offsetHeight;
    
    isMobile = false;
    if(window.innerWidth <= mobileCutoff || document.body.clientWidth <= mobileCutoff) {
        isMobile = true;
    }
    
    if(!isMobile) {
        navBar.removeEventListener("webkitTransitionEnd", relocateNavBarLocator);
        navBar.removeEventListener("transitionend", relocateNavBarLocator);
        navBarLocator.style.top = "-100%";
    }
    else {
        navBar.addEventListener("webkitTransitionEnd", relocateNavBarLocator);
        navBar.addEventListener("transitionend", relocateNavBarLocator);
        if(navBar.style.top == "-100%") {
            navBarLocator.style.top = "2.5vmax";
        }
    }
}


/* Update Button: Timer to Next Hour */

function setUpdateTimer(waitTime) {
    setTimeout(function() {
        sunArrayUpdateButton.style.visibility = "visible";
    }, waitTime + waitTimeAdjust);
}


/* Update Button: Filter and Apply Update */

function updateCarouselArrays() {
    var currentDate = new Date();
    for(var type in sunObject) {
        var currentLoadTimeAdjust = initialLoadSpecification[type].loadTimeAdjust;
        var formattedDate = formatDate((Math.floor(currentDate/hourToMilliSec) - currentLoadTimeAdjust)*hourToMilliSec);
        var currentSunArray = sunArray[type];
        var currentCarouselFilter = sunObject[type].carouselFilter;
        var sunArrayObject = dateToSunArrayObject(formattedDate, type);
        
        currentSunArray.push(sunArrayObject);
        currentCarouselFilter.setAttribute("src", sunArrayObject.src);
    }

    sunArrayUpdateButton.style.visibility = "hidden";
    setUpdateTimer(getMilliSecToNextHour());
}

function filterCarouselUpdate(type) {
    sunArray[type].pop();
    console.clear();
    console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
}

function applyCarouselUpdate(type) {
    var currentSunArray = sunArray[type];
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    currentSunArray.unshift(currentSunArray.pop());
    currentCarouselSlider.value = currentCarouselSlider.max;
    currentCarousel.setAttribute("src", currentSunArray[0].src);
    currentCarouselDate.innerHTML = currentSunArray[0].date;
}


/* Navigation Bar: Smooth Scroll */

$(document).ready(function() {
    $("a").on("click", function(event) {
        if (this.hash !== "" && !this.hash.includes("page=")) {
            event.preventDefault();

            var scrollDestination = $(this.hash).offset().top - scrollPositionAdjust;
            var scrollTime = Math.abs(scrollDestination - window.scrollY) * scrollTimeAdjust;
            if (scrollTime > scrollTimeMax) {
                scrollTime = scrollTimeMax;
            }

            $("html, body").animate({
                    scrollTop: scrollDestination
                },
                scrollTime,
                function() {
                    navBar.style.top = "-100%";
                    forcedHideNavBar = true;
                    setTimeout(function() {
                        forcedHideNavBar = false;
                    }, 100);
                }
            );
        }
    });
});


/* Navigation Bar: Hide Navbar */

window.onscroll = function() {
    var newScrollPosition = window.pageYOffset;
    if ((newScrollPosition >= oldScrollPosition && newScrollPosition > minimumOffsetForHide) || forcedHideNavBar) {
        navBar.style.top = "-100%";
    } 
    else if(!isMobile || newScrollPosition < minimumOffsetForHide) {
        navBar.style.top = "2vh";
    }
    oldScrollPosition = newScrollPosition;
}


/* Navigation Bar: Locator (mobile only) */

function displayNavigationBar() {
    navBarLocator.style.top = "-100%";
    navBar.style.top = "2vh";
}

function relocateNavBarLocator() {
    if(navBar.style.top == "2vh") {
        navBarLocator.style.top = "-100%";
    }
    else if(navBar.style.top == "-100%" && oldScrollPosition >= minimumOffsetForHide) {
        navBarLocator.style.top = "2.5vmax";
    }
}


/* Carousel Filter Events (initial) */

function filterCarousel(type) {
    var currentCarouselFilter = sunObject[type].carouselFilter;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentSunArray.splice(currentSunArrayIndex, 1);
    
    while (currentCarouselSlider.max > currentSunArray.length-1) {
        currentCarouselSlider.max -= 1;
        if(currentSunArrayIndex != 0) {
            currentCarouselSlider.value -= 1;
        }
    }
    if (currentCarouselSlider.value < 0) {
        currentCarouselSlider.value = 0;
    }
    currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    if(currentSunArray.length > 0) {
        currentCarouselFilter.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
        currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;    
    }
}

function continueCarouselFilter(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselFilter = sunObject[type].carouselFilter;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    var currentPreferredSliderMaxValue = initialLoadSpecification[type].preferredSliderMaxValue;
    
    sunArrayObjectLoaded[type] += 1;
    var currentSunArrayObjectLoaded = sunArrayObjectLoaded[type]; 
    
    if(currentSunArrayObjectLoaded < currentPreferredSliderMaxValue && currentSunArray.length > currentSunArrayObjectLoaded+2) {
        currentCarousel.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
        currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;
        currentCarouselSlider.value -= 1;
        currentSunArrayIndex += 1;
        currentCarouselFilter.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
    }
    else {
        var functionParameter = "('" + type + "')";
        
        currentCarouselSlider.value = currentCarouselSlider.max;
        currentCarousel.setAttribute("src", currentSunArray[0].src);
        currentCarouselDate.innerHTML = currentSunArray[0].date;
        
        currentCarouselFilter.setAttribute("onerror", "filterCarouselUpdate" + functionParameter);
        currentCarouselFilter.setAttribute("onload", "applyCarouselUpdate" + functionParameter);
        
        currentCarousel.setAttribute("onclick", "enterForcedSliderFocus" + functionParameter);
        currentCarousel.setAttribute("onmouseout", "exitForcedSliderFocus" + functionParameter);
        currentCarouselSlider.setAttribute("oninput", "updateCarousel" + functionParameter);
        
        currentCarousel.setAttribute("style", "pointer-events: auto");
        currentCarouselSlider.setAttribute("style", "pointer-events: auto");
        
        console.clear();
        console.log("Welcome to the Console!\nEnjoy your stay here\nand dont't break the Code!");
    }
}


/* Carousel Events */

function reportImage(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentSunArray.splice(currentSunArrayIndex, 1);
    
    while (currentCarouselSlider.max > currentSunArray.length-1) {
        currentCarouselSlider.max -= 1;
        if(currentSunArrayIndex != 0) {
            currentCarouselSlider.value -= 1;
        }
    }
    if (currentCarouselSlider.value < 0) {
        currentCarouselSlider.value = 0;
    }
    currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentCarousel.setAttribute("src", currentSunArray[currentSunArrayIndex].src);
    currentCarouselDate.innerHTML = currentSunArray[currentSunArrayIndex].date;    
}

function relocateCarouselSlider(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSliderContainer = sunObject[type].carouselSliderContainer;

    var offsetX = currentCarousel.offsetLeft - currentCarouselSliderContainer.offsetLeft - 10;
    var offsetY = currentCarousel.offsetTop - currentCarouselSliderContainer.offsetTop;
    var carouselSize = currentCarousel.offsetWidth;
    var sliderSize = 200;
    //currentCarouselSliderContainer.style.transform = "translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px)";
    currentCarouselSliderContainer.setAttribute("style", "-webkit-transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px); transform: translate(" + (offsetX) + "px, " + (offsetY+carouselSize/2-sliderSize/2) + "px);");
    
    oldScrollPosition = window.pageYOffset;
    minimumOffsetForHide = crossHereToHideNavBar.offsetTop /* - scrollPositionAdjust */ - navBar.offsetHeight;

   currentCarousel.setAttribute("onload", null);
}

function updateCarousel(type) {
    var currentCarousel = sunObject[type].carousel;
    var currentCarouselSlider = sunObject[type].carouselSlider;
    var currentCarouselDate = sunObject[type].carouselDate;
    
    var currentSunArray = sunArray[type];
    var currentSunArrayIndex = currentCarouselSlider.max - currentCarouselSlider.value;
    
    currentCarousel.setAttribute("src", sunArray[type][currentSunArrayIndex].src);
    currentCarouselDate.innerHTML = sunArray[type][currentSunArrayIndex].date;
};

function enterForcedSliderFocus(type) {
    if(!isMobile) {
        var currentCarouselSlider = sunObject[type].carouselSlider;
        currentCarouselSlider.focus();
        currentCarouselSlider.style.opacity = 1;
    }
}

function exitForcedSliderFocus(type) {
    var currentCarouselSlider = sunObject[type].carouselSlider;
    currentCarouselSlider.style.opacity = 0.7;
    currentCarouselSlider.blur();
}


/* Support Functions */

function dateToSunArrayObject(date, type) {
    if(type == "visible") {
        var url = "https://soho.nascom.nasa.gov/data/REPROCESSING/Completed/" + date.year + "/c2/" + date.year + "" + returnTwoDigits(date.month+1) + "" + returnTwoDigits(date.day) + "/" + date.year + "" + returnTwoDigits(date.month+1) + "" + returnTwoDigits(date.day) + "_" + returnTwoDigits(date.hour) + returnTwoDigits(date.minute) + "_c2_512.jpg";
    }
    else if(type == "radio") {
        var url = "http://www.tauceti.caltech.edu/marinanderson/solar/hourly/" + date.year + "-" + returnTwoDigits(date.month+1) + "-" + returnTwoDigits(date.day) + "-" + returnTwoDigits(date.hour) + ":" + returnTwoDigits(date.minute) + ":00-image.jpg";
    }
        
    var timeStamp = date.year + "-" + returnTwoDigits(date.month+1) + "-" + returnTwoDigits(date.day) + " " + returnTwoDigits(date.hour) + ":" + returnTwoDigits(date.minute) + ":00 UTC";
    return {
        src: url,
        date: timeStamp,
    };
}

function formatDate(date) {
    var givenDate = new Date(date);
    
    var day = givenDate.getUTCDate();
    var month = givenDate.getUTCMonth();
    var year = givenDate.getUTCFullYear();
    var hour = givenDate.getUTCHours();
    var minute = givenDate.getUTCMinutes();
    
    monthArray[1].setDay(year);
    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
    };
}

function subtractTime(amount, type, object) {
    var data = getShallowCopyOfObject(object);
    data[type] -= amount;
    while (data.minute < 0) {
        data.hour -= 1;
        data.minute += 60;
    }
    while (data.hour < 0) {
        data.day -= 1;
        data.hour += 24;
    }
    while (data.day < 1) {
        data.month -= 1;
        if (data.month == 1) {
            monthArray[1].setDay(data.year);
        }
        else if (data.month == -1) {
            data.year -= 1;
            data.month += 12;
        }
        data.day += monthArray[data.month].day;
    }
    while (data.month < 0) {
        data.year -= 1;
        data.month += 12;
    }
    return data;
}

function addTime(amount, type, object) {
    var data = getShallowCopyOfObject(object);
    data[type] += amount;
    while (data.hour > 59) {
        data.minute -= 59;
        data.hour += 1;
    }
    while (data.hour > 23) {
        data.hour -= 24;
        data.day += 1;
    }
    while (data.day > monthArray[data.month].day) {
        data.day -= monthArray[data.month].day;
        data.month += 1;
        if (data.month == 1) {
            monthArray[1].setDay(data.year);
        }
        else if (data.month > 11) {
            data.month -= 12;
            data.year += 1;
        }
    }
    while (data.month > 11) {
        data.month -= 12;
        data.year += 1;
    }
    return data;
}

function getMilliSecToNextHour() {
    var currentHour = new Date();
    var nextHour = Math.ceil(currentHour / hourToMilliSec) * hourToMilliSec;
    return (nextHour - currentHour);
}

function returnTwoDigits(number) {
    if (number < 10) {
        return ("0" + number);
    }
    else if (number > 99) {
        return String(number).substr(-2);
    }
    else{
        return number;
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getShallowCopyOfObject(source) {
    return Object.assign({}, source);
}

function getOffset(element) {
    var rect = element.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { 
        top: rect.top + scrollTop, 
        left: rect.left + scrollLeft,
    };
}


/* Citation System */

var citationData = [
    {
        src: "https://www.washingtonpost.com/news/speaking-of-science/wp/2017/03/30/how-mars-lost-its-atmosphere-and-why-earth-didnt/?noredirect=on&utm_term=.44a64bfe5693",
        formatted: "Achenbach, J. (2017, March 30). How Mars lost its atmosphere, and why Earth didn't. Retrieved from https://www.washingtonpost.com/news/speaking-of-science/wp/2017/03/30/how-mars-lost-its-atmosphere-and-why-earth-didnt/?noredirect=on&utm_term=.44a64bfe5693",
    },
    {
        src: "https://www.khanacademy.org/science/in-in-class11th-physics/in-in-11th-physics-units-and-measurement/in-in-11th-physics-physical-quantities-and-their-measurement/a/angular-measure-1",
        formatted: "Angular measure 1. (n.d.). Retrieved from https://www.khanacademy.org/science/in-in-class11th-physics/in-in-11th-physics-units-and-measurement/in-in-11th-physics-physical-quantities-and-their-measurement/a/angular-measure-1",
    },
    {
        src: "https://www.swpc.noaa.gov/phenomena/coronal-mass-ejections/",
        formatted: "Coronal Mass Ejections. (n.d.). Retrieved from https://www.swpc.noaa.gov/phenomena/coronal-mass-ejections/.",
    },
    {
        src: "https://www.omnicalculator.com/physics/angular-resolution",
        formatted: "Czernia, D. (2019, February 22). Angular Resolution Calculator. Retrieved from https://www.omnicalculator.com/physics/angular-resolution",
    },
    {
        src: "https://www.sciencealert.com/here-s-what-would-happen-if-solar-storm-wiped-out-technology-geomagnetic-carrington-event-coronal-mass-ejection",
        formatted: "Dockrill, P. (n.d.). Here's What Would Happen if a Solar Storm Wiped Out Technology as We Know It. Retrieved from https://www.sciencealert.com/here-s-what-would-happen-if-solar-storm-wiped-out-technology-geomagnetic-carrington-event-coronal-mass-ejection",
    },
    {
        src: "http://www.astro.caltech.edu/~vikram/bne_talks/hallinan.pdf",
        formatted: "Hallinan, G. (n.d.) The Owens Valley LWA [PDF file]. Retrieved from http://www.astro.caltech.edu/~vikram/bne_talks/hallinan.pdf",
    },
    {
        src: "https://hesperia.gsfc.nasa.gov/summerschool/lectures/vourlidas/AV_intro2CMEs/additional%20material/corona_history.pdf",
        formatted: "Howard, R. (2006, October). A Historical Perspective on Coronal Mass Ejections [PDF file]. Retrieved from https://hesperia.gsfc.nasa.gov/summerschool/lectures/vourlidas/AV_intro2CMEs/additional%20material/corona_history.pdf",
    },
    {
        src: "https://www.space.com/24903-kepler-space-telescope.html",
        formatted: "Howell, E. (2018, December 07). Kepler Space Telescope: The Original Exoplanet Hunter. Retrieved from https://www.space.com/24903-kepler-space-telescope.html",
    },
    {
        src: "http://www.kiss.caltech.edu/final_reports/Magnetic_final_report.pdf#page=63",
        formatted: "Keck Institute for Space Studies. (2016, June) Planetary Magnetic Fields Final Report [PDF file]. Retrieved from http://www.kiss.caltech.edu/final_reports/Magnetic_final_report.pdf#page=63",
    },
    {
        src: "https://www.scientificamerican.com/article/sun-unleashes-strongest-solar-flare-of-past-decade/?wt.mc=SA_Facebook-Share",
        formatted: "Lewin, S. (2017, September 06). Sun Unleashes Strongest Solar Flare of Past Decade. Retrieved from https://www.scientificamerican.com/article/sun-unleashes-strongest-solar-flare-of-past-decade/?wt.mc=SA_Facebook-Share",
    },
    {
        src: "http://science.nasa.gov/ems/05_radiowaves",
        formatted: "National Aeronautics and Space Administration, Science Mission Directorate. (2010). Radio Waves. Retrieved from http://science.nasa.gov/ems/05_radiowaves",
    },
    {
        src: "http://www.tauceti.caltech.edu/LWA/",
        formatted: "(n.d.). Retrieved from http://www.tauceti.caltech.edu/LWA/",
    },
    {
        src: "https://science.nasa.gov/science-news/news-articles/earths-magnetosphere",
        formatted: "(n.d.). Retrieved from https://science.nasa.gov/science-news/news-articles/earths-magnetosphere",
    },
    {
        src: "https://swrc.gsfc.nasa.gov/main/score",
        formatted: "(n.d.). Retrieved from https://swrc.gsfc.nasa.gov/main/score",
    },
    {
        src: "http://www.scientificamerican.com/article/bracing-for-a-solar-superstorm/",
        formatted: "Odenwald, S. F. (n.d.). Bracing the Satellite Infrastructure for a Solar Superstorm. Retrieved from http://www.scientificamerican.com/article/bracing-for-a-solar-superstorm/.",
    },
    {
        src: "https://public.nrao.edu/telescopes/radio-frequency-interference/",
        formatted: "Radio Frequency Interference. (n.d.). Retrieved from https://public.nrao.edu/telescopes/radio-frequency-interference/",
    },
    {
        src: "https://www.space.com/22215-solar-wind.html",
        formatted: "Redd, N. T., & Redd, N. T. (2018, May 19). What is Solar Wind? Retrieved from https://www.space.com/22215-solar-wind.html",
    },
    {
        src: "http://www2.mps.mpg.de/homes/solanki/saas_fee_39/SaasFee39_Handout_L3.pdf",
        formatted: "Solanki, S. (n.d.) Sunspot magnetic fields [PDF file]. Retrieved from http://www2.mps.mpg.de/homes/solanki/saas_fee_39/SaasFee39_Handout_L3.pdf",
    },
    {
        src: "http://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts",
        formatted: "Solar Flares (Radio Blackouts). (n.d.). Retrieved from http://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts.",
    },
    {
        src: "https://www.ready.gov/space-weather",
        formatted: "Space Weather. (n.d.). Retrieved from https://www.ready.gov/space-weather",
    },
    {
        src: "https://www.space.com/15139-northern-lights-auroras-earth-facts-sdcmp.html",
        formatted: "Staff, S. (2017, October 11). Aurora Borealis: What Causes the Northern Lights & Where to See Them. Retrieved from https://www.space.com/15139-northern-lights-auroras-earth-facts-sdcmp.html",
    },
    {
        src: "https://science.howstuffworks.com/solar-flare-electronics1.htm",
        formatted: "Strickland, J. (2019, April 05). Could an extremely powerful solar flare destroy all the electronics on Earth? Retrieved from https://science.howstuffworks.com/solar-flare-electronics1.htm",
    },
    {
        src: "http://www.qrg.northwestern.edu/projects/vss/docs/thermal/1-how-does-heat-move.html",
        formatted: "Temperature System. (n.d.). Retrieved from http://www.qrg.northwestern.edu/projects/vss/docs/thermal/1-how-does-heat-move.html",
    },
    {
        src: "https://www.spaceweatherlive.com/en/help/what-are-solar-flares",
        formatted: "What are solar flares?: Help. (n.d.). Retrieved from https://www.spaceweatherlive.com/en/help/what-are-solar-flares",
    },
    {
        src: "https://www.nasa.gov/content/goddard/the-difference-between-flares-and-cmes",
        formatted: "Zell, H. (2015, February 10). The Difference Between Flares and CMEs. Retrieved from https://www.nasa.gov/content/goddard/the-difference-between-flares-and-cmes",
    },
    /*{
        src: "",
        formatted: "",
    },*/
];

var contentData = [
    {
        destination: "overviewSpace1",
        content: "Coronal mass ejections are a type of solar eruption that can occur separate from or immediately after a solar flare. Although they occasionally appear together, they differ in composition, movement, size, and the way that they affect nearby planets.<br>Both types of solar eruptions are caused by the sun’s magnetic field; hence, they generally travel together. For an idea of what the magnetic field looks like, Tom Bridgman from NASA provides an exceptional <a href='https://svs.gsfc.nasa.gov/4623' target='_blank' class='normalLink'>video</a> to inspire the average mind.",
    },
    {
        destination: "overviewSpace2",
        content: "As you may have observed or known, the sun’s magnetic field is constantly bending and twisting, behaving as a rubber band may in the hands of a child[[25]]. This warping process is a consequence of the convection within the sun, which circulates heat and matter[[23]]. Over time, the contortions within the magnetic field result in spontaneous realignments, triggering destructive solar phenomena[[3]]. Imagine that the child were to suddenly remove its hands and allow the rubber band to unwind itself. In the realignment, properly known as magnetic reconnection, the sun unwinds its magnetic field and “ejects” part of its mass as its magnetic potential energy is then converted to kinetic energy[[3]].<br>In the event of a solar flare, stored energy is launched from the magnetic realignment. This ranges from drenching heat to high-energy, high-damaging electromagnetic waves.<br>If the catapulted energy creates the flare, the actual solar plasma that occasionally accompanies it is the CME. Coronal Mass Ejections are quite large, occasionally reaching a size that is approximately equivalent to a “quarter of the space between the earth and the sun”[[3]].",
    },
    {
        destination: "overviewSpace3",
        content: "The most notable differences between the two are their effects on Earth. Because solar flares are powerful bursts of electromagnetic waves, inclusive of X-ray and ultraviolet light, they can disrupt the part of Earth’s atmosphere in which radio waves traverse, the ionosphere, through a process called ionization[[19]]. In certain cases, these flares can prompt minor communication and navigation services blackouts[[25]].<br>Respectively, coronal mass ejections may amplify the intensity of aurora by surging the atmosphere with high-energy, subatomic particles. Though they are a sight to behold, massive aurora also serve as a warning. Aurora are produced by interactions between oxygen and nitrogen in the atmosphere with excited subatomic particles[[21]]. An increase in such particles contain the potential to overcharge nearby electronic devices, after which, they may glitch and/or malfunction. As a result, CMEs can potentially destroy our GPS system and radio stations[[22]].<br>The arrival of either, in adequate magnitude, imperils the structure of international technology and services. Luckily for us, just as solar eruptions were precipitated by the sun’s magnetic field, the earth, too, maintains its own magnetic field. This magnetic field prevents entry from extraterrestrial objects and drastically reduces the damage from solar eruptions and ambient solar wind[[13]].",
    },
    {
        destination: "historySpace1",
        content: "The most recent “powerful” solar flare occurred on September 6, 2017, at 12:02 pm UTC. That flare had a magnitude of X9.3, which was the most powerful since 2006, the flare was recorded to have a magnitude of X9.0[[10]].",
    },
    {
        destination: "historySpace2",
        content: "In 1859, the strongest solar flare in recorded history arrives. Known as the Carrington Event, this solar storm ensued in the largest geomagnetic perturbation in recorded history, likely by an escorting CME[[15]][[5]]. At the time, we did not possess the tools and instruments that we have and use today, but the solar storm affected telegraphs and created massive northern auroras as far south as the Carribean and southern auroras as far north as Australia.",
    },
    {
        destination: "historySpace3",
        content: "The first official detection of a CME came December of 1971.<br>When an image of the sun taken by the SEC-Vidicon camera from the seventh Orbiting Solar Observatory arrived much brighter than usual, it was believed that there was a malfunction with the camera[[7]]. After another image came in with the sun displaying expected luminosity, scientists deduced that it was a solar event.<br>Both coronal mass ejections and solar flares, if directed towards Earth, have the potential to negatively impact our lives and our livelihoods. Both impact our communication and navigation services, and in some cases, may even fry electrical grids[[22]]. These solar eruptions erode and distort the Earth’s atmosphere, and flares, in particular, can damage important satellites orbiting the earth. By studying CMEs and solar flares, we can better prepare ourselves, and our technology, to receive these devastating solar events[[20]].",
    },
    {
        destination: "historySpace4",
        content: "But not all is woe with the sun. Just as it affects Earth, we can study extrasolar weather to understand the effects of stars outside of our solar system on their own exoplanets. By doing this, we can dwindle down which exoplanets are considered potentially habitable in our pursuit for and of life[[6]].",
    },
    {
        destination: "dataSpace1",
        content: "The Long Wavelength Array, located at the <i>Owens Valley Observatory</i>, records and processes radio waves ranging from 27MHz to 85MHz[[12]]. Similar to a walkie-talkie, the LWA operates with 288 crossed broadband dipoles antennas to detect and record these waves. With humans, the pupil size determines the angular resolution with which one can see, where angular resolution represents the ability to distinguish small details of an object[[2]][[4]]. With the OVRO-LWA, the array dimension fulfills the task of the pupil size. This is characterized in the equation for angular resolution: Θ = λ / d, where Θ is the angular resolution (smaller is better), λ is the desired wavelength, and d is the distance between two polar antennas. As radio waves are fairly long, the distance between polar antennas need to be farther apart for better resolution; hence, the operation necessitates 288 antennas. The data from the array can be processed by a computer into coherent images as shown above under “OVRO-LWA: Radio”.",
    },
    {
        destination: "dataSpace2",
        content: "Though the instrument does not rely on polished mirrors for clarity as an optical telescope will, the LWA does demand a non-polluted environment. Just as an optical telescope fears light pollution, which rendered the night sky unseeable, a radio telescope fears radio frequency interference. Radio stations, especially those of the FM category, emits radio waves at or close to the frequency with which the LWA read. As a result, the station may <i>interfere</i> with the observation of the LWA[[16]]. The interference results in blurred or incorrect images due to bad data. As such, the LWA was built in Owens Valley, far from populated cities and protected by high mountain ranges.",
    },
    /*{
        destination: "dataSpace3",
        content: "There are three important layers/regions of the sun that astronomers study: photosphere, chromosphere, and the corona. Although they vary in temperature, and in the radio wavelengths they emit, they are all affected by the sun’s magnetic field. Sun spots, which are observable with the naked eye (not recommended), are cooler spots on the sun’s  photosphere because the contorted magnetic field has inhibited the flow of gas and heat[[18]]. These spots are points from which solar eruptions tends to arise.<br>The LASCO Corona images by SOHO show the motion of the corona. The particles that make up the corona move outward from the sun, and the particles that leave the corona do not disappear. They continue to move across the solar system as solar wind. Solar wind, essentially, is a minor variation of coronal mass ejections. The solar wind’s speed depends on magnetic field activities, among other factors. As the corona is mainly plasma, it is attracted to the magnetic field lines of the sun[[17]]. In the absence or scarcity of magnetic activity, solar wind is able to travel faster.<br>Radio waves are produced by the acceleration of electrons. During solar activities, the magnetic field changes, affecting electrons. As such, more radio waves are produced during solar activities.<br>Thus, the images are able to help differentiate between different parts of the sun’s magnetic field.",
    },*/
    {
        destination: "dataSpace3",
        content: "The produced radio images can be interpreted in multiple ways; however, they must be observed with the correct mindset. The sun under visible wavelengths and the sun under radio wavelengths are two different suns. Visible light is mainly emitted in the photosphere. It is what one may see on a cloudless day <i>(not recommended)</i>. Radio waves are produced from the acceleration of electrons[[11]]. This may occur in any place where there is a magnetic field. The OVRO-LWA radio images view the sun with respect to the magnetic field. Hence, during solar activities, the shape of the radio sun is deformed. The magnetic field influences these activities in both known and unknown ways.",
    },
    {
        destination: "exoplanetSpace1",
        content: "Exoplanets are planets that exist beyond our solar system. Astronomers use telescopes, such as the retired Kepler space telescope, to find potentially habitable planets for humans[[8]]. By studying the effects of space weather on exoplanets, astronomers can assess whether or not a planet can support human life. One of the more devastating effects of CMEs on a planet is the erosion of the atmosphere, which occurs when a planet does not possess an adequate magnetic field to protect itself. Theoretically, Mars’ core froze in the past, leading to the collapse of its magnetic field. As a result of this, CMEs slowly eroded the atmosphere of the planet, causing it to be thinner now than before[[1]].",
    },
    {
        destination: "exoplanetSpace2",
        content: "What we know about Mars can be applied to exoplanets. If we know that a planet’s magnetic field has collapsed or is not strong enough to protect its atmosphere, there’s a high likelihood that the planet’s atmosphere will be eroded. A radio telescope can perform such functions. The OVRO-LWA is looking for radio emission associated with stellar magnetic activity. Radio astronomers can determine whether a planet has a magnetic field based on its interaction with a nearby star, its “Sun”, during dramatic stellar events, such as Coronal Mass Ejections[[9]].<br>Though the magnetic field criteria is a valid one, it is not the only one. Water, energy, and shelter are needed for life. If all of the criteria are met, maybe life is just ticking to be born, somewhere sometime in the universe.",
    },
    {
        destination: "creditSpace1",
        content: "Great achievements are the result of many. This website cannot be brought to you without the gracious contribution from SOHO, NASA and Hallinan Group, Caltech. And to <a href='http://www.spaceweather.com' target='_blank' class='normalLink'>spaceweather.com</a> for bringing astronomy news to everyday men.<br>Science and astronomy has, and always will be, possible by the people, so to readers like you, thank you. May you have fortune in the path you choose to engage.<br><span style='float: right;'>- Caltech Interns, Summer 2019</span><br>",
    },
    {
        destination: "flareClassificationCaption",
        content: "Classification of Solar Flares[[24]]",
    },
    {
        destination: "cmeClassificationCaption",
        content: "Classification of Coronal Mass Ejections[[14]]",
    },
];

createReferenceSpace();
function createReferenceSpace() {
    var text = "<ol>";
    for(var i=0, length=citationData.length; i<length; i++) {
        var current = citationData[i];
        var dissectedCitation = current.formatted.split(current.src);
        text += "<li>" + dissectedCitation[0] + "<a href='" + current.src + "' target='_blank' id='citationLink" + (i+1) + "'>" + current.src + "</a>" + dissectedCitation[1] + "</li>"; 
    }
    text += "</ol>";
    
    document.getElementById("referenceSpace1").innerHTML = text;
}

createContentWithCitation();
function createContentWithCitation() {
    for(var current of contentData) {
        var text = "<span style='margin-left: 5vw;'></span>";
        var dissectedContent = current.content.replace(/<br>/g, "<br><br><span style='margin-left: 5vw;'></span>").split("]]");
        for(var textPiece of dissectedContent) {
            if(textPiece != "") {
                var dissectedTextPiece = textPiece.split("[[");
                if(dissectedTextPiece.length > 1) {
                    var citationDataIndex = Number(dissectedTextPiece[1]) - 1;
                    text += dissectedTextPiece[0] + "&nbsp;<sup><span class='tooltip'><a href='#citationLink" + dissectedTextPiece[1] + "'>[&nbsp;<span>" + dissectedTextPiece[1] + "</span>&nbsp;]</a><a href='" + citationData[citationDataIndex].src + "' target='_blank' tabindex='-1' class='tooltipText'>" + citationData[citationDataIndex].src.replace("http://", "").replace("https://", "") + "</a></span></sup>"; 
                }
                else {
                    text += dissectedTextPiece[0];
                }
            }
        }
        document.getElementById(current.destination).innerHTML = text;
    }
}

/*
Check for oversized elements
var docWidth = document.documentElement.offsetWidth;

[].forEach.call(
  document.querySelectorAll('*'),
  function(el) {
    if (el.offsetWidth > docWidth) {
      console.log(el);
    }
  }
);*/
