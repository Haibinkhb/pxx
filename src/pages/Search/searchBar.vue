<template>
    <div class="searchContainer">
        <div class="topBar">
            <div class="Wrapper">
                <div class="img"><img src="./imgs/icon_search.png" alt=""></div>
                <input type="text" class="inputWrapper" placeholder="针织套装">
            </div>
            <div class="cancel" @click="changeRouter('/search')">
                <span>取消</span>
            </div>
        </div>
        <div class="listWrapper"></div>
    </div>
</template>

<script>
export default {
    methods:{
        changeRouter(path){
            this.$router.replace(path);
        }
    }
}
</script>

<style>
    .searchContainer{
       
        width: 100%;
        height:100%;
        background-color: #fff;
    }
    .topBar{
        width: 100%;
        height: 50px;
        padding: 5px 5px 5px 10px;
        border-bottom: 1px solid #ededed;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .Wrapper{
        width: 85%;
        height: 100%;
        background-color: #ededed;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 5px;
        border-radius: 10px;
    }
    .Wrapper .img{
        width: 10%;
        
    }
    .img img{
        width: 60%;
        padding-top: 3px;
    }
    .inputWrapper{
        width: 90%;
        height: 100%;
        background-color: #ededed;
        border: none;
        font-size: 16px;
    }
    .inputWrapper:focus{
        outline: none;
    }
    .cancel{
        width: 15%;
        height: 100%;
        text-align: center;
        line-height: 40px;
        color: #9c9c9c;
    }
    .listWrapper{
        width: 100%;
        height: 90%;
        background-color: #fff;

    }
</style>
