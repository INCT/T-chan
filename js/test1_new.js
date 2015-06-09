  //resp 

  $(document).ready(function() {
      $( "#tabs" ).tabs();
  });

  // 桁数が1桁だったら先頭に0を加えて2桁に調整する
  function set2fig(num) {
     var ret;
     if( num < 10 ) { ret = "0" + num; }
     else { ret = num; }
     return ret;
  }


  var harfMin = "30";
  var listTime = "08:00:00";
  var nowMin = "00";
  var nowHour = "08";
  var isFirst = true;

  // 現在時刻の表示
  function showClock2() {
     var nowTime = new Date();
     nowHour = set2fig( nowTime.getHours() );
     nowMin = set2fig( nowTime.getMinutes() );
     var nowSec = set2fig( nowTime.getSeconds() );
     var msg = nowHour + ":" + nowMin + ":" + nowSec ;
     document.getElementById("RealtimeClockArea2").innerHTML = msg;
     
     //現在時刻をセット
     if(isFirst){
         var ListHour = nowHour;
         if(nowMin>30){
          harfMin = "00";
          ListHour = set2fig(nowTime.getHours() + 1);
        }

         listTime = ListHour + ":"+harfMin+":00";
         //console.log(listTime);

          $('#dec_time option').each(function(i,elem){
              if(listTime == $(elem).val()){
/*                $("#dec_time option[value='default']").append($(elem).val());
                $("#dec_time option[value='default']").val( $(elem).html() );*/
                $('#dec_time').val($(elem).val());
              }
          });

          var days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Studay");

          $('#dec_week option').each(function(i,elem){
              if(days[nowTime.getDay()] == $(elem).val()){/*
                $("#dec_week option[value='default']").append($(elem).val());
                $("#dec_week option[value='default']").val( $(elem).html() );*/
                $('#dec_week').val($(elem).val());
              }
          });

          $('#dec_time').change();
          $('#dec_week').change();
          $("table select option[value='default']").remove();

          isFirst = false;
      }
  }


  var nowFlag = false;

  onload = function() {
    draw_c1();
    draw_c2();
    draw_c3();
    draw_c4();

    $("#toggle").click(function() {
        if(!nowFlag) {
            console.log("現在地見てます");
            nowFlag = true;
            getNowPlace(true);
        } else {
            nowFlag = false;
            console.log("未来見てます");
            callBackData(true);
        }
    });

    $('table select').change(function(){
        if(nowFlag) {
            console.log("現在地見てます");
            getNowPlace(true);
        } else {
            console.log("未来見てます");
            callBackData(true);
        }
    });


    $("#tabs li").click(function (event) {
        if(event.target.id == "ui-id-1"){
          var canvas = document.getElementById('c1');
          if ( ! canvas || ! canvas.getContext ) { return false; }
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,10000,10000);

  /*
          draw_ec('c1',0.19830028328611898,0.013227513227513227,0.16997167138810199,0.1455026455026455,10); //Lego
          draw_ec('c1',0.36827195467422097,0.07936507936507936,0.2521246458923513,0.21164021164021163,20);  //Yoke
          draw_ec('c1',0.6197308781869688,0.013227513227513227,0.18013597733711048,0.2777777777777778,30);  //Cloth
          draw_ec('c1',0.7988668555240793,0.013227513227513227,0.18413597733711048,0.35714285714285715,40); //Electro
          draw_ec('c1',0.71,0.37,0.27,0.13,50); //Another Yoke
          draw_ec('c1',0.015,0.71,0.36,0.275,60); //5C
          draw_ec('c1',0.375,0.71,0.125,0.21,70); //Koshino
          draw_ec('c1',0.5,0.71,0.125,0.21,80); //Yoke
          draw_ec('c1',0.625,0.71,0.36,0.275,90); //5E*/
        }

        else if(event.target.id == "ui-id-2"){
          var canvas = document.getElementById('c2');
          if ( ! canvas || ! canvas.getContext ) { return false; }
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,10000,10000);
    /*
          draw_ec('c2',0.015,0.013227513227513227,0.36,0.275,10); //Lego
          draw_ec('c2',0.36827195467422097,0.0775,0.2521246458923513,0.21164021164021163,20);  //Yoke
          draw_ec('c2',0.6197308781869688,0.013227513227513227,0.37,0.2777777777777778,30);  //Cloth
          draw_ec('c2',0.715,0.37,0.275,0.13,50); //Another Yoke
          draw_ec('c2',0.015,0.71,0.36,0.275,60); //5C
          draw_ec('c2',0.375,0.71,0.125,0.21,70); //Koshino
          draw_ec('c2',0.5,0.71,0.125,0.21,80); //Yoke
          draw_ec('c2',0.625,0.71,0.37,0.275,90); //5E
          */
        }

        else if(event.target.id == "ui-id-3"){
          var canvas = document.getElementById('c3');
          if ( ! canvas || ! canvas.getContext ) { return false; }
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,10000,10000);
    /*
          draw_ec('c3',0.019,0.028,0.35,0.266,10); //Lego
          draw_ec('c3',0.369,0.089,0.13,0.2,20);  //Yoke
          draw_ec('c3',0.50,0.089,0.125,0.2,20);  //Yoke
          draw_ec('c3',0.619,0.022,0.362,0.267,30);  //Cloth
          draw_ec('c3',0.715,0.37,0.26,0.13,50); //Another Yoke
          draw_ec('c3',0.025,0.705,0.352,0.27,60); //5C
          draw_ec('c3',0.375,0.705,0.125,0.203,70); //Koshino
          draw_ec('c3',0.5,0.705,0.125,0.203,80); //Yoke
          draw_ec('c3',0.625,0.703,0.355,0.273,90); //5E*/
        }

        else if(event.target.id == "ui-id-4"){
          var canvas = document.getElementById('c4');
          if ( ! canvas || ! canvas.getContext ) { return false; }
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,10000,10000);
    /*
          draw_ec('c4',0.01,0.5,0.415,0.485,10); //Lego
          draw_ec('c4',0.42,0.505,0.415,0.485,10); //Lego*/
        }

      if(!nowFlag){
        callBackData(false);
      } else{
        getNowPlace(false);
      }
    });

    //$("button").click(function(){
    /*
      $.ajax({
                type: "POST",
                url: "ajax.php",
                data: {
                      "teacher": $('select[name="teacher"]').val();
                      "time": $('select[name="time"]').val();
                      "week": $('select[name="week"]').val();
                },
                success: function(j_data){

                  var floor = j_data.floor_id;
                  var x = j_data.x;
                  var y = j_data.y;
                  var w = j_data.width;
                  var h = j_data.height;
                  var per = j_data.probability;

                  alert(floor + ":" +x + ":" +y + ":" +w + ":" +h + ":" +per);
     
                    // 処理を記述
                    //返り値 : 地図、座標、％など
     
                }
            });*/
    //draw_ec(x,y,w,h,確率)
    /*
      draw_ec('c1',217,5,65,105,60); //更衣室
      draw_ec('c1',217+65,5,65,135,20);  //電気室
      draw_ec('c1',70,5,60,55,10); //レゴ室
      draw_ec('c1',70+60,30,89,80,10); //かわよけん
      */
  /*

      draw_ec('c2',0.19830028328611898,0.013227513227513227,0.16997167138810199,0.1455026455026455,10); //Lego
      draw_ec('c2',0.36827195467422097,0.07936507936507936,0.2521246458923513,0.21164021164021163,20);  //Yoke
      draw_ec('c2',0.6197308781869688,0.013227513227513227,0.18013597733711048,0.2777777777777778,30);  //Cloth
      draw_ec('c2',0.7988668555240793,0.013227513227513227,0.18413597733711048,0.35714285714285715,40); //Electro
      draw_ec('c2',0.71,0.37,0.27,0.13,50); //Another Yoke
      draw_ec('c2',0.015,0.71,0.36,0.275,60); //5C
      draw_ec('c2',0.375,0.71,0.125,0.21,70); //Koshino
      draw_ec('c2',0.5,0.71,0.125,0.21,80); //Yoke
      draw_ec('c2',0.625,0.71,0.36,0.275,90); //5E
      */
    //});


    setInterval('showClock2()',1000);
  }

  // 1階のcanvas
  function draw_c1() {
    var canvas = document.getElementById('c1');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');

    ctx.globalAlpha = 0.0;
    ctx.fillStyle = 'rgb(192, 80, 77)';
    ctx.beginPath();
    ctx.fillRect(0, 0, 353, 378);
  }

  function draw_c2() {
    var canvas = document.getElementById('c2');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.0;
    ctx.fillStyle = 'rgb(192, 80, 77)';
    ctx.beginPath();
    ctx.fillRect(0, 0, 351, 376);
  }

  function draw_c3() {
    var canvas = document.getElementById('c3');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.0;
    ctx.fillStyle = 'rgb(192, 80, 77)';
    ctx.beginPath();
    ctx.fillRect(0, 0, 429, 301);
  }
  function draw_c4() {
    var canvas = document.getElementById('c4');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.0;
    ctx.fillStyle = 'rgb(192, 80, 77)';
    ctx.beginPath();
    ctx.fillRect(0, 0, 429, 301);
  }

  function getRectPer(can_name,x,y,w,h){
    var px,py,pw,ph;
    per_x = x / $("#"+can_name).width();
    per_y = y /$("#"+can_name).height();
    per_w = w / $("#"+can_name).width();
    per_h = h / $("#"+can_name).height();

    //console.log("draw_ec('c1',"+per_x + "," +per_y + "," +per_w + "," +per_h+",80);");
  }

  function draw_ec(can_name,x,y,w,h,per) {
    if(per == "0")  return;

  //  alert(can_name);

    var canvas = document.getElementById(can_name);
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    /* 半透明度を指定 */

    var room_x = x * $("#"+can_name).width();
    var room_y = y * $("#"+can_name).height();
    var room_w = w * $("#"+can_name).width();
    var room_h = h * $("#"+can_name).height();
  /*
    var room_x = x;
    var room_y = y;
    var room_w = w;
    var room_h = h;*/

    ctx.globalAlpha = 0.5;
    /* 円 #1 */
      ctx.beginPath();

    /*
    if(per>50){
      ctx.fillStyle = 'rgb('+per*4+', '+(300-per*3)+',' + (200-per*2) + ')';
    }
    else if(per=="here"){
        ctx.fillStyle = 'rgb(255,0,0)'; // 赤
    }
    else{
      ctx.fillStyle = 'rgb('+per*4+', '+(per*3)+',' + (200-per*2) + ')';
    }*/

    ctx.fillStyle = 'rgb(0,0,255)';
    ctx.globalAlpha = per*0.006;


                  console.log(x +":"+y +":"+w +":"+h+":"+per);

    //ctx.arc(70, 45, 35, 0, Math.PI*2, false);
    ctx.fillRect(room_x, room_y, room_w, room_h);
    ctx.fill();

    var txt_s = room_w / 3;
    var txt_x = room_x;
    var txt_y = room_y+room_h;
    txt_y*=0.9;

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = txt_s+"px 'メイリオ'";
    ctx.globalAlpha = 1;
    ctx.fillText(per,txt_x+txt_s*0.3 ,txt_y);
    ctx.fill();

    // alert($("div[aria-hidden='false'] canvas").width());

    // alert($("div[aria-hidden='false'] canvas").height());
    //getRectPer(can_name,x,y,w,h);
  }