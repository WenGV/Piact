$(function () {




    //Load data
    var user={
        'idUser':0,
        "Status":1
    };

    $("tr .indexInput").on("click", function () {
        console.log(this);
        user.email = this.name;
        user.Status = this.dirName;
        changeProfile();
    });

    var changeProfile = function(){
        $.post("/Login/UsersIndex", user, function (data) {
            location.reload();
            //climaticData = data;
            //data = climaticData.categories;
            //var items = "<option>Seleccione aqu&iacute;</option>";
            //$.each(data, function (i, category) {
            //    items += "<option " + "value='" + category.ID + "'>" + category.Name + "</option>";
            //});
            
        });
    }
});