
    function draw_Arrow_STD(x,y, dx, dy, color='#000000') {
        let arrow_directon = Math.atan2(dy, dx);
        let arrhd_dx1 = 15*Math.cos(arrow_directon + 5*Math.PI/6);
        let arrhd_dy1 = 15*Math.sin(arrow_directon + 5*Math.PI/6);
        let arrhd_dx2 = 15*Math.cos(arrow_directon - 5*Math.PI/6);
        let arrhd_dy2 = 15*Math.sin(arrow_directon - 5*Math.PI/6);

        ctx.strokeStyle=color;
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x+dx, y+dy);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + dx + arrhd_dx1, y + dy + arrhd_dy1);
        ctx.lineTo(x+dx, y+dy);
        ctx.lineTo(x + dx + arrhd_dx2, y + dy + arrhd_dy2);
        ctx.stroke();
    }

    function draw_POS_CHG(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2*Math.PI);
        ctx.fillStyle='#DD4444';
        ctx.fill();
        
        ctx.font = "20px Times";
        ctx.fillStyle='#FFFFFF';
        ctx.textBaseline='middle';
        ctx.textAlign='center';
        ctx.fillText("+", x, y);
    }

    function draw_NEG_CHG(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2*Math.PI);
        ctx.fillStyle='#444444';
        ctx.fill();
        
        ctx.font = "20px Times";
        ctx.fillStyle='#FFFFFF';
        ctx.textBaseline='middle';
        ctx.textAlign='center';
        ctx.fillText("-", x, y);
    }