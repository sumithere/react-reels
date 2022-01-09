import java.util.*;

public class xyz{
    public static void fn(){

        String str="hi hello";
        String nstr="";
        for(int i=str.length()-1;i>=0;i--){
            nstr+=str.charAt(i);
        }
        System.out.println(nstr);
        
    }
    public static void main(String[] args){
        fn();
    }
}

