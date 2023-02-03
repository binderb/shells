function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function gcd(a,b) {
    return b ? gcd(b, a%b) : a;
}

function lcm_two_numbers(x, y) {
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

function reduce(numerator,denominator){
  var my_gcd = gcd(numerator,denominator);
  return [numerator/my_gcd, denominator/my_gcd];
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

function containsObjectWithName(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].name == obj.name) {
            return true;
        }
    }

    return false;
}