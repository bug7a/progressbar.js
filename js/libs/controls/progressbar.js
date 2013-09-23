
/**
 *
 * Created with NetBeans IDE
 *
 * Code     : ProgressBar JS
 * Version  : 1.0
 *
 * User     : Bugra OZDEN
 * Site     : http://www.bugraozden.com
 * Mail     : bugra.ozden@gmail.com
 *
 * Date     : 9/14/13
 * Time     : 1:10 PM
 *
 */



ProgressBar.OPTION_NAME                     = {};

ProgressBar.OPTION_NAME.ITEM_ID             = "itemID";
ProgressBar.OPTION_NAME.TYPE                = "type";       // bar, line, text
ProgressBar.OPTION_NAME.PERCENT             = "percent";    // 0% - 100%
ProgressBar.OPTION_NAME.COLOR_ID            = "colorID";
ProgressBar.OPTION_NAME.OPACITY             = "opacity";    // 0.0 - 1.0
ProgressBar.OPTION_NAME.ALIGN               = "align";      // left, right
ProgressBar.OPTION_NAME.SPACE               = "space";      // 0% - 100%
ProgressBar.OPTION_NAME.POSITION            = "position";   // absolute, relative

ProgressBar.OPTION_VALUE                    = {};
ProgressBar.OPTION_VALUE.COLOR_ID           = {};
ProgressBar.OPTION_VALUE.COLOR_ID.BLUE      = "blue";
ProgressBar.OPTION_VALUE.COLOR_ID.GREEN     = "green";
ProgressBar.OPTION_VALUE.COLOR_ID.YELLOW    = "yellow";
ProgressBar.OPTION_VALUE.COLOR_ID.ORANGE    = "orange";
ProgressBar.OPTION_VALUE.COLOR_ID.RED       = "red";
ProgressBar.OPTION_VALUE.COLOR_ID.WHITE     = "white";
ProgressBar.OPTION_VALUE.COLOR_ID.BLACK     = "black";

ProgressBar.OPTION_VALUE.TYPE               = {};
ProgressBar.OPTION_VALUE.TYPE.BAR           = "bar";
ProgressBar.OPTION_VALUE.TYPE.LINE          = "line";
ProgressBar.OPTION_VALUE.TYPE.TEXT          = "text";

ProgressBar.OPTION_VALUE.ALIGN              = {};
ProgressBar.OPTION_VALUE.ALIGN.LEFT         = "left";
ProgressBar.OPTION_VALUE.ALIGN.RIGHT        = "right";

ProgressBar.OPTION_VALUE.POSITION           = {};
ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE  = "absolute";
ProgressBar.OPTION_VALUE.POSITION.RELATIVE  = "relative";

ProgressBar.DEFAULT_VALUE                   = {};
ProgressBar.DEFAULT_VALUE.WIDTH             = "100px";
ProgressBar.DEFAULT_VALUE.HEIGHT            = "6px";

ProgressBar.DEFAULT_VALUE.TYPE              = ProgressBar.OPTION_VALUE.TYPE.BAR;
ProgressBar.DEFAULT_VALUE.PERCENT           = 0;
ProgressBar.DEFAULT_VALUE.COLOR_ID          = ProgressBar.OPTION_VALUE.COLOR_ID.BLUE;
ProgressBar.DEFAULT_VALUE.OPACITY           = 1;
ProgressBar.DEFAULT_VALUE.ALIGN             = "left";
ProgressBar.DEFAULT_VALUE.SPACE             = 0;
ProgressBar.DEFAULT_VALUE.POSITION          = "relative";

ProgressBar.DEFAULT_VALUE.LINE_COLOR_ID     = ProgressBar.OPTION_VALUE.COLOR_ID.RED;
ProgressBar.DEFAULT_VALUE.LINE_OPACITY      = 0.5;

ProgressBar.EVENT                           = {};
ProgressBar.EVENT.STARTING                  = "starting";
ProgressBar.EVENT.CHANGED                   = "changed";
ProgressBar.EVENT.COMPLETED                 = "completed";



function ProgressBar ($elementID, $options){
   
    $options = $options || {};

    if($elementID){
        
        this.private = {};
        this.private._elementID = $elementID;
        this.private._element = document.getElementById($elementID);
        
        this.private._items = [];
        this.private._itemElements = [];
        this.private._width = "";
        this.private._height = "";
        
        //Hızlı bulma
        this.private._exItemID = "";
        this.private._exItemIndex = "";
        
        //Value kullanma
        this.private._maxValue = 100;
        this.private._centesimal = 1;
        this.private._exValues = {};
        
        this.setWidth($options.width || ProgressBar.DEFAULT_VALUE.WIDTH);
        this.setHeight($options.height || ProgressBar.DEFAULT_VALUE.HEIGHT);

        this.private._element.innerHTML = "";
        this.private._element.setAttribute('class', 'progressbar-control');

    }

}

ProgressBar.prototype.getElement = function() { return this.private._element; };
   
ProgressBar.prototype.getWidth = function(){ return this.private._width; };
ProgressBar.prototype.setWidth = function($width){

    this.private._width = this.private._element.style.width = $width;
    return true;

};

ProgressBar.prototype.getHeight = function(){ return this.private._height; };
ProgressBar.prototype.setHeight = function($height){

    this.private._height = this.private._element.style.height = $height;
    return true;

};

ProgressBar.prototype.createItem = function($item){
    
    if(typeof $item == "string") {
        
        var itemID = $item;
        
        $item = {};
        $item[ProgressBar.OPTION_NAME.ITEM_ID] = itemID;
    
    }

    /*

     <div id="my-progressbar" class="progressbar-control">
        <div class="item-bar"></div>
        <div class="item-bar"></div>
        <div class="item-line"></div>
     </div>

     */

    $item = $item || {};
    
    //Yeni nesne için element oluştur
    var itemElement = this.private._element.appendChild(document.createElement('div'));
    
    var itemID = $item[ProgressBar.OPTION_NAME.ITEM_ID] = $item[ProgressBar.OPTION_NAME.ITEM_ID] || "";
    
    //Daha önce eklenmiş nesne var ise ID siz nesne ekleyemez.
    if(this.private._items.length > 0 && itemID == "") return false;

    // DEFAULT değerleri set et.
    $item[ProgressBar.OPTION_NAME.TYPE]     = $item[ProgressBar.OPTION_NAME.TYPE] || ProgressBar.DEFAULT_VALUE.TYPE;    
    $item[ProgressBar.OPTION_NAME.PERCENT]  = $item[ProgressBar.OPTION_NAME.PERCENT]    || ProgressBar.DEFAULT_VALUE.PERCENT;
    $item[ProgressBar.OPTION_NAME.ALIGN]    = $item[ProgressBar.OPTION_NAME.ALIGN]      || ProgressBar.DEFAULT_VALUE.ALIGN;
    
    //SPACE varsa POSITION: ABSOLUTE olmalı
    if($item[ProgressBar.OPTION_NAME.SPACE]){
        
        $item[ProgressBar.OPTION_NAME.POSITION] = ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE;
        
    }else{
        
        $item[ProgressBar.OPTION_NAME.SPACE] = ProgressBar.DEFAULT_VALUE.SPACE;
        // (OK)ERROR: SPACE değeri olmayan bir ABSOLUTE item oluşturulamıyorudu.
        $item[ProgressBar.OPTION_NAME.POSITION] = $item[ProgressBar.OPTION_NAME.POSITION] || ProgressBar.OPTION_VALUE.POSITION.RELATIVE;
        
    }
    
    //TYPE a göre değişen DEFAULT değerler
    switch($item[ProgressBar.OPTION_NAME.TYPE]){
        
        case ProgressBar.OPTION_VALUE.TYPE.BAR:

            $item[ProgressBar.OPTION_NAME.COLOR_ID] = $item[ProgressBar.OPTION_NAME.COLOR_ID]   || ProgressBar.DEFAULT_VALUE.COLOR_ID;
            $item[ProgressBar.OPTION_NAME.OPACITY]  = $item[ProgressBar.OPTION_NAME.OPACITY]    || ProgressBar.DEFAULT_VALUE.OPACITY;

            break;

        case ProgressBar.OPTION_VALUE.TYPE.LINE:

            $item[ProgressBar.OPTION_NAME.COLOR_ID] = $item[ProgressBar.OPTION_NAME.COLOR_ID]   || ProgressBar.DEFAULT_VALUE.LINE_COLOR_ID;
            $item[ProgressBar.OPTION_NAME.OPACITY]  = $item[ProgressBar.OPTION_NAME.OPACITY]    || ProgressBar.DEFAULT_VALUE.LINE_OPACITY;
            $item[ProgressBar.OPTION_NAME.POSITION] = ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE;

            break;

    }
    
    // Nesneyi listeye ekle
    this.private._items.push($item);
    this.private._itemElements.push(itemElement);
    
    //nesneyi oluşturulurken gizle
    itemElement.style.opacity = 0;

    itemElement.classList.add('item-' + $item[ProgressBar.OPTION_NAME.TYPE]);

    this.setOptionValue(ProgressBar.OPTION_NAME.COLOR_ID, $item[ProgressBar.OPTION_NAME.COLOR_ID], itemID);
    this.setOptionValue(ProgressBar.OPTION_NAME.ALIGN, $item[ProgressBar.OPTION_NAME.ALIGN], itemID);
    // ALIGN değeri set edildiğinde SPACE değeri otomatik güncellenir.
    //if($item[ProgressBar.OPTION_NAME.SPACE]) this.setOptionValue(ProgressBar.OPTION_NAME.SPACE, $item[ProgressBar.OPTION_NAME.SPACE], itemID);
    this.setOptionValue(ProgressBar.OPTION_NAME.POSITION, $item[ProgressBar.OPTION_NAME.POSITION], itemID);
    // PERCENT değeri set edildiğinde opacity değeri otomatik güncellenir.
    //this.setOptionValue(ProgressBar.OPTION_NAME.OPACITY, $item[ProgressBar.OPTION_NAME.OPACITY], itemID);
    this.setOptionValue(ProgressBar.OPTION_NAME.PERCENT, $item[ProgressBar.OPTION_NAME.PERCENT], itemID);
    
    return true;

};

ProgressBar.prototype.removeItem = function($itemID){
    
    var itemIndex = this._getItemIndexByID($itemID);
    var itemElement = this.private._itemElements[itemIndex];
    
    if(itemElement != null ){

        itemElement.parentNode.removeChild(itemElement);
        this.private._items.splice(itemIndex  ,1);
        this.private._itemElements.splice(itemIndex  ,1);
        
        return true;

    }

    return false;

};

ProgressBar.prototype.removeAll = function(){

    if(this.private._element){

        this.private._element.innerHTML = "";
        this.private._items = [];
        this.private._itemElements = [];
        
        return true;

    }

    return false;

};

ProgressBar.prototype.getMaxValue = function() { return this.private._maxValue; };
ProgressBar.prototype.setMaxValue = function($maxValue){

        if(this.private._maxValue != $maxValue && $maxValue) {
            
            this.private._centesimal = 100 / $maxValue;
            this.private._maxValue = $maxValue;
            
        }

    return this.private._centesimal;

};

ProgressBar.prototype.getExValue = function($itemID) { 
    
    $itemID = $itemID || "first";
    
    var result = this.private._exValues[$itemID] || 0;
    
    return result;
    
};
ProgressBar.prototype.getPercentByValue = function($value, $itemID, $maxValue){
    
    //Yeni maxValue gelmişse set et.
    if($maxValue && $maxValue != this.getMaxValue()) this.setMaxValue($maxValue);
    
    //value değeri 0 - maxValue arasında olabilir.
    if($value < 0) $value = 0;
    if($value > this.getMaxValue()) $value = this.getMaxValue();
    
    //itemID boş ise first olarak adlandır.
    $itemID = $itemID || "first";

    this.private._exValues[$itemID] = $value;
    var result = ($maxValue) ? $value * this.getMaxValue($maxValue) : $value * this.private._centesimal;
    
    return parseInt(result);
    
};

ProgressBar.prototype.getOptionValue = function($optionName, $itemID){

    var itemIndex = this._getItemIndexByID($itemID);

    return this.private._items[itemIndex][$optionName];

};

ProgressBar.prototype.setOptionValue = function($optionName, $value, $itemID){
    
    var itemIndex = this._getItemIndexByID($itemID);
    
    var itemElement = this.private._itemElements[itemIndex];
    var item = this.private._items[itemIndex];

    switch ($optionName) {
        
        case ProgressBar.OPTION_NAME.ITEM_ID:
            
            //unchangeable option
            return false;
            
            break;
            
        case ProgressBar.OPTION_NAME.TYPE:
            
            //unchangeable option
            return false;
           
            break;
        
        case ProgressBar.OPTION_NAME.PERCENT:
            
            var me = this;
            
            setTimeout(function(){
            
            //Sadece tam değer al.
            $value = parseInt($value) || 0;
            
            switch(item[ProgressBar.OPTION_NAME.TYPE]) {
                
                case ProgressBar.OPTION_VALUE.TYPE.BAR:
                    
                        $value = me._calculateAvailablePercent($value, itemIndex);
                        itemElement.style.width = $value + '%';
                        item[ProgressBar.OPTION_NAME.PERCENT] = $value;
                        
                    break;
                    
                case ProgressBar.OPTION_VALUE.TYPE.LINE:
                                            
                        //SPACE değeri değiştiğinde LINE nesnesi için PERCENT değeride otomatik değişir.
                        //item[ProgressBar.OPTION_NAME.PERCENT] = $value;
                        me.setOptionValue(ProgressBar.OPTION_NAME.SPACE, $value, $itemID);
                        
                        //Görünürlüğü ayarla
                        //itemElement.style.opacity = item[ProgressBar.OPTION_NAME.OPACITY];
                        
                    break;
                
            }
            
            // Bar yüzdesi 0 ise geçici olarak görünmez yap
            var isShown = ($value == 0 ) ? 0 : item[ProgressBar.OPTION_NAME.OPACITY];
            itemElement.style.opacity = isShown;
            
            setTimeout(function(){
                
                me.private._element.dispatchEvent(new CustomEvent(ProgressBar.EVENT.CHANGED, {'detail':{'itemID':$itemID, 'me':me}} ));
                
                switch($value){
                    
                    case 0:
                        
                        me.private._element.dispatchEvent(new CustomEvent(ProgressBar.EVENT.STARTING, {'detail':{'itemID':$itemID, 'me':me}} ));
                        break;

                    case 100:
                        
                        me.private._element.dispatchEvent(new CustomEvent(ProgressBar.EVENT.COMPLETED, {'detail':{'itemID':$itemID, 'me':me}} ));
                        break;

                    default:
                     
                        break;

                }
                
            }, 240);
            
            }, 10);

            break;

        case ProgressBar.OPTION_NAME.COLOR_ID:

            itemElement.classList.remove(item[ProgressBar.OPTION_NAME.COLOR_ID]);
            itemElement.classList.add($value);
            item[ProgressBar.OPTION_NAME.COLOR_ID] = $value;
            
            break;
            
        case ProgressBar.OPTION_NAME.OPACITY:

            //Sadece PERCENT > 0 ise uygula
            if(item[ProgressBar.OPTION_NAME.PERCENT]) itemElement.style.opacity = $value;
            item[ProgressBar.OPTION_NAME.OPACITY] = $value;
            
            break;
            
        case ProgressBar.OPTION_NAME.ALIGN:
            
            //ALIGN değeri değiştiğinde POSITION, RELATIVE olmalı
            //this.setOptionValue(ProgressBar.OPTION_NAME.POSITION, ProgressBar.OPTION_VALUE.POSITION.RELATIVE, $itemID);
            
            itemElement.style.float = $value;
            item[ProgressBar.OPTION_NAME.ALIGN] = $value;
            
            //ALIGN değeri değişir ise SPACE değerini güncelle
            if(item[ProgressBar.OPTION_NAME.POSITION] == ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE)
                if(item[ProgressBar.OPTION_NAME.SPACE]) 
                    this.setOptionValue(ProgressBar.OPTION_NAME.SPACE, item[ProgressBar.OPTION_NAME.SPACE], $itemID);

            break;
            
        case ProgressBar.OPTION_NAME.SPACE:
            
            //LINE nesnesi için SPACE değeri PERCENT değeridir.
            if(item[ProgressBar.OPTION_NAME.TYPE] == ProgressBar.OPTION_VALUE.TYPE.LINE){
                
                // Değer 0 ile 100 arasında olmalı
                if($value < 0) $value = 0;
                if($value > 100) $value = 100;
                
                item[ProgressBar.OPTION_NAME.PERCENT] = $value;
                
            }

            //SPACE değeri verilirse position u absolute yap.
            if(item[ProgressBar.OPTION_NAME.POSITION] != ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE)
                this.setOptionValue(ProgressBar.OPTION_NAME.POSITION, ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE, $itemID);
            
            //Önceki değeri sıfırla
            itemElement.style.left = "";
            itemElement.style.right = "";
            
            itemElement.style[item[ProgressBar.OPTION_NAME.ALIGN]] = $value + '%';
            item[ProgressBar.OPTION_NAME.SPACE] = $value;
            
            // TODO: BAR ise PERCENT değerini tekrar güncelle, değişiklik olabilir.
            if(item[ProgressBar.OPTION_NAME.TYPE] == ProgressBar.OPTION_VALUE.TYPE.BAR)
                this.setOptionValue(ProgressBar.OPTION_NAME.PERCENT, item[ProgressBar.OPTION_NAME.PERCENT], $itemID);
                        
            break;
            
        case ProgressBar.OPTION_NAME.POSITION:
            
            switch(item[ProgressBar.OPTION_NAME.TYPE]) {
                
                case ProgressBar.OPTION_VALUE.TYPE.BAR:
                    
                        //POSITION, RELATIVE ise SPACE değerini sil.
                        if($value == ProgressBar.OPTION_VALUE.POSITION.RELATIVE){
                            itemElement.style.left = "";
                            itemElement.style.right = "";

                            //SPACE değerini array içine yaz.
                            item[ProgressBar.OPTION_NAME.SPACE] = 0;
                        }

                        itemElement.style.position = $value;
                        item[ProgressBar.OPTION_NAME.POSITION] = $value;
            
                    break;
                    
                case ProgressBar.OPTION_VALUE.TYPE.LINE:
                    
                        //LINE nesnesi için POSITION değeri düzenlenemez.
                        $value = ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE;
                        itemElement.style.position = $value;
                        item[ProgressBar.OPTION_NAME.POSITION] = $value;
                    
                    break;
                    
            }
            
            break;

    }
    
    return true;

};

ProgressBar.prototype.getPercent = function($itemID){
    
    return this.getOptionValue(ProgressBar.OPTION_NAME.PERCENT, $itemID);

};

ProgressBar.prototype.setPercent = function($value, $itemID){

    return this.setOptionValue(ProgressBar.OPTION_NAME.PERCENT, $value, $itemID);

};

ProgressBar.prototype.initialMode = function(isInitialMode){
    
    if(isInitialMode){
        
        this.removeAll();
        this.setPercent(25);
        
        //this.setOptionValue(ProgressBar.OPTION_NAME.OPACITY, 0.7);
        this.setOptionValue(ProgressBar.OPTION_NAME.COLOR_ID, ProgressBar.OPTION_VALUE.COLOR_ID.WHITE);
        
        var me = this;

        //Engine çalışmadan önce PERCENT set edilebilsin.
        setTimeout(function(){
            me._initialModeEngine();
        }, 50);
        
    }else{
        
        clearTimeout(this._initialModeTimer);
        this.removeAll();
        
    }
    

    
};

ProgressBar.prototype._initialModeEngine = function(){
    
    if(this.private._items.length == 1){
        
        var me = this;
        
        var itemIndex = 0;
        var item = this.private._items[itemIndex];
        
        var currentAlign = this.getOptionValue(ProgressBar.OPTION_NAME.SPACE);

        var nextAlign = ( currentAlign == 0) 
            ? 100 -  this.getOptionValue(ProgressBar.OPTION_NAME.PERCENT)
            : 0;

        this.setOptionValue(ProgressBar.OPTION_NAME.SPACE, nextAlign, item[ProgressBar.OPTION_NAME.ITEM_ID]); 

        this._initialModeTimer = setTimeout(function(){
            me._initialModeEngine();
        }, 700);

    }
    
};

//itemID sinden, items (array) içinde hangi sırada olduğunu bul.
ProgressBar.prototype._getItemIndexByID = function($itemID){
    
    // Hızlı bulma
    if ($itemID && $itemID == this.private._exItemID) {
        return this.private._exItemIndex;
    }

    var itemIndex = 0;

    //length 1 ise [0]
    if(this.private._items.length != 1){

        //length 0 ise yeni oluştur
        if(this.private._items.length == 0){

            //var itemID = $itemID || "";
            this.createItem({'itemID':$itemID});

        //length > 1 ise bul
        }else if(this.private._items.length > 1){
            
            //itemID boş ise [0]
            if (!$itemID) return 0;
            
            //hepsine bak
            for(var i = 0, j = this.private._items.length; i < j; i++ ){

                if(this.private._items[i][ProgressBar.OPTION_NAME.ITEM_ID] == $itemID ){

                    //Bulunan nesnenin bilgilerini sakla.
                    this.private._exItemID = $itemID;
                    this.private._exItemIndex = i;
                    
                    return i;

                }

            }

        }

    }

    return itemIndex;

};

// Set edilen boyut için yeterli alan var mı?
ProgressBar.prototype._calculateAvailablePercent = function($percent ,$itemIndex){

    if($percent < 0) return 0;

    var item = this.private._items[$itemIndex];

    var totalUsedPercent = 0;
    var availablePercent = 0;

    switch(item[ProgressBar.OPTION_NAME.POSITION]){

        case ProgressBar.OPTION_VALUE.POSITION.RELATIVE:

            for(var i = 0, j = this.private._items.length; i < j; i++ ){

                if(i != $itemIndex &&
                    this.private._items[i][ProgressBar.OPTION_NAME.POSITION] == ProgressBar.OPTION_VALUE.POSITION.RELATIVE){

                    totalUsedPercent += this.private._items[i][ProgressBar.OPTION_NAME.PERCENT];

                }

            }

            availablePercent = 100 - totalUsedPercent;
            
            //POSITION: RELATIVE olan nesneler arasında yer kalmaz ise COMPLETED yap.
            if(($percent >= availablePercent)) {
                
                var me = this;
            
                setTimeout(function(){

                    me.private._element.dispatchEvent(new CustomEvent(ProgressBar.EVENT.COMPLETED, {'detail':{'itemID':item.itemID, 'me':me}} ));

                }, 500);
                
            }
                

            break;

        case ProgressBar.OPTION_VALUE.POSITION.ABSOLUTE:

            availablePercent = 100 - item[ProgressBar.OPTION_NAME.SPACE];

            break;

    }

    return ($percent <= availablePercent) ? $percent : availablePercent;

};
