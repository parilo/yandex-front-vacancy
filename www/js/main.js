
$(function() {

    var ratingWidgets = [];
    var progressBarWidgets = {};
    
    $('.rating').each(function(){
        var r = new Rating(this);
        
        r.change(function(event){
            alert('rated: ' + event.value);
        });
        
        ratingWidgets.push(r);
    });
    
    $('.progress-bar').each(function(){
        progressBarWidgets[$(this).attr('data-name')] = new ProgressBar(this);
    });
    
    $('.run1').click(function(){
        runProgress(progressBarWidgets.progress1);
    });
    
    $('.run2').click(function(){
        runProgress(progressBarWidgets.progress2);
    });
    
    $('.run3').click(function(){
        runProgress(progressBarWidgets.progress3);
    });
    
    $('.runall').click(function(){
        runProgress(progressBarWidgets.progress1);
        runProgress(progressBarWidgets.progress2);
        runProgress(progressBarWidgets.progress3);
    });

});

function runProgress(progressBar){
    var previousVal = progressBar.getValue();
    var timerId = setInterval(function(){
        var v = progressBar.getValue();
        if ( v >= 100 ) {
            progressBar.setValue(previousVal);
            clearInterval(timerId);
        } else {
            progressBar.setValue(v+1);
        }
    }, 20);
}




function Rating (elem) {
    
    var self = this;
    this.elem = elem;
    
    this.registerEvents('change');
    
    this.value = $(this.elem).attr('data-value');
    
    this.optionWidgets = [];
    
    this.highlightHandler = function(event){
        self.showValue(event.source.getModel());
    };
    
    this.unhighlightHandler = function(event){
        self.showValue(self.value);
    };
    
    this.choiseHandler = function(event){
        var val = event.source.getModel();
        self.setValue(val);
        self.fire('change', { value: val});
    };
    
    $(elem).find('.rating-option').each(function(index){

        var item = new RatingItem(this);
        item.setModel(index+1);
        self.initItem(item);
        
        self.optionWidgets.push(item);
        
    });
    
};

Rating.prototype = {
    
    setValue: function (value) {
        this.value = value;
        this.showValue(this.value);
    },
    
    showValue: function (value) {
        for(var i=0; i<this.optionWidgets.length; i++){
            this.optionWidgets[i].setHighlighted(i<value);
        }
    },
    
    initItem: function (item) {
        item.highlight(this.highlightHandler);
        item.unhighlight(this.unhighlightHandler);
        item.choise(this.choiseHandler);
    }
    
};

Rating = L.Funcs.mixIn(Rating, L.HandlersTool);



function RatingItem(elem) {
    
    this.registerEvents(
        'highlight',
        'unhighlight',
        'choise'
    );
    
    var self = this;
    
    this.elem = elem;

    $(this.elem).mouseenter(function(event){
        self.fire('highlight', {source: self});
    });
    
    $(this.elem).mouseleave(function(event){
        self.fire('unhighlight', {source: self});
    });
    
    $(this.elem).click(function(event){
        self.fire('choise', {source: self});
    });
    
};

RatingItem.prototype = {
    
    setModel: function (model) {
        this.model = model;
    },
    
    getModel: function () {
        return this.model;
    },
    
    setHighlighted: function (highlighted) {
        if( highlighted ){
            $(this.elem).addClass('act');
        } else {
            $(this.elem).removeClass('act');
        }
    }
    
};

RatingItem = L.Funcs.mixIn(RatingItem, L.HandlersTool);





function ProgressBar(elem) {
    
    var self = this;
    this.elem = elem;
    this.progressEl = $(this.elem).find('.progress')[0];
    this.valueEl = $(this.elem).find('.progress-label')[0];
    
    this.value = parseInt($(this.elem).attr('data-value'));

};

ProgressBar.prototype = {
    
    setValue: function (value) {
        this.value = value;
        $(this.progressEl).css('width', this.value+'%');
        $(this.valueEl).text(this.value+'%');
    },
    
    getValue: function () {
        return this.value;
    }
    
};



