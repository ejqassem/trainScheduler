var foodImage = $("<img>");
foodImage.attr("id", "food-img");
foodImage.attr("src", businessImage[imageCount]); // Or random index value?
$("#food-images").append(foodImage);
