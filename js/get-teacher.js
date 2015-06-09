$(document).ready(function() {

    $.ajax({
        url  : "teacher_list.php",
        dataType: "json"
    })
    .done(function (data) {
        if(data == null) alert('データが0件でした');

        //返ってきたデータの表示
        var $content = $('#content');
        for (var i = 0; i < data.length; i++) {
            $content.append("<li>" + data[i].id + data[i].name + "</li>");
        }

        var listbox = document.getElementsByTagName("select").item(0);
        for (var i = 0; i < data.length; i++){
            	var $o = document.createElement('option');
            	$o.value = data[i].id;
            	$o.innerHTML = data[i].name;
            	listbox.appendChild($o);
        }

            
    })
    .fail(function () {
        alert("fail");
    });

    $("button").click(function(){
        
        //getNowPlace();



        /*
        var id = $("div[aria-hidden='false'] canvas").attr( "id" );
        var canvas = document.getElementById(id);

        $("div[aria-hidden='false'] canvas").width($("#tabs div[aria-hidden='false'] img").width()+"px");
        $("div[aria-hidden='false'] canvas").height($("#tabs div[aria-hidden='false'] img").height()+"px");

        // canvas.style.width = $("div[aria-hidden='false'] img").width()+"px";
        // canvas.style.height = $("div[aria-hidden='false'] img").height()+"px";

        // $("div[aria-hidden='false'] canvas").width(1000);
        // $("div[aria-hidden='false'] canvas").height(1000);

        var ctx = canvas.getContext('2d');
        callBackData(true);

        // ctx.fillRect(0, 0, $("div[aria-hidden='false'] canvas").width(), $("div[aria-hidden='false'] canvas").height());

        */
    });
    
});

function callBackData(flag){    //タブチェンジするフラグ true:最高確率のフロアが表示される
        $.ajax({
            type: "POST",
            url: "get_probability.php",
            dataType: "json",
            data: {
                "teacher_id": $('select[name="teacher"]').val(),
                "time": $('select[name="time"]').val(),
                "weekday": $('select[name="week"]').val(),
            }
        })
        .done(function (j_data) {
            if(j_data == null){
                var canvas = document.getElementById($("div[aria-hidden='false'] canvas").attr("id"));
                if ( ! canvas || ! canvas.getContext ) { return false; }
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,10000,10000);

                console.log('データが0件でした :'+ j_data);
                return;
            }
            
            $("div[aria-hidden='false'] canvas").width("100px");
            $("div[aria-hidden='false'] canvas").height("150px");


            for (var i = 0; i < j_data.length; i++) {
                var floor = j_data[i].floor_id;
                var x = j_data[i].x;
                var y = j_data[i].y;
                var w = j_data[i].width;
                var h = j_data[i].height;
                var per = j_data[i].probability;
                
                if(floor==5) floor = 4;

                if(i==0 && flag){
                    $("#ui-id-" + floor).click();
                }

                if(i==0){
                    var canvas = document.getElementById('c'+floor);
                    if ( ! canvas || ! canvas.getContext ) { return false; }
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,10000,10000);
                }

                if(per!="0"){
                    draw_ec('c'+floor,x,y,w,h,per);
                }
            }

            var id = $("div[aria-hidden='false'] canvas").attr( "id" );
            //console.log(id);
            var canvas = document.getElementById(id);

            $("div[aria-hidden='false'] canvas").width($("#tabs div[aria-hidden='false'] img").width()+"px");
            $("div[aria-hidden='false'] canvas").height($("#tabs div[aria-hidden='false'] img").height()+"px");
                    
        })
        .fail(function (request,status,error) {
            // alert(data);
            console.log(error);
        });
}

function getNowPlace(flag){
    $.ajax({
            type: "POST",
            url: "nowplace.php",
            dataType: "json",
            data: {
                "teacher_id": $('select[name="teacher"]').val()
            }
        })
        .done(function (j_data) {
            if(j_data == null){
                var canvas = document.getElementById($("div[aria-hidden='false'] canvas").attr("id"));
                if ( ! canvas || ! canvas.getContext ) { return false; }
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,10000,10000);

                console.log('データが0件でした :'+ j_data);
                return;
            }
            
            $("div[aria-hidden='false'] canvas").width("100px");
            $("div[aria-hidden='false'] canvas").height("150px");

            for (var i = 0; i < j_data.length; i++) {
                var floor = j_data[i].floor_id;
                var x = j_data[i].x;
                var y = j_data[i].y;
                var w = j_data[i].width;
                var h = j_data[i].height;

                if(floor != 0){
                    if(floor==5) floor = 4;   
                    if(flag) $("#ui-id-" + floor).click();        

                    var canvas = document.getElementById('c'+floor);
                    if ( ! canvas || ! canvas.getContext ) { return false; }
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,10000,10000);
                    
                    console.log(floor);
                    draw_ec('c'+floor,x,y,w,h,"here");
                }
            }

            var id = $("div[aria-hidden='false'] canvas").attr( "id" );
            var canvas = document.getElementById(id);

            $("div[aria-hidden='false'] canvas").width($("#tabs div[aria-hidden='false'] img").width()+"px");
            $("div[aria-hidden='false'] canvas").height($("#tabs div[aria-hidden='false'] img").height()+"px");
                    
        })
        .fail(function (request,status,error) {
            // alert(data);
            console.log(error);
        });
}
