<p>В качестве клиента,&nbsp;для работы связки клиент-сервер, будем использовать&nbsp;PrologueClient&nbsp;<img alt="laugh" src="http://frontend.prologue-framework.ru/Prologue/components/editors/ckeditor/ckeditor/plugins/smiley/images/teeth_smile.png" style="height:23px; width:23px" title="laugh" /></p>

<h2><strong>Установка:</strong></h2>

<p><strong>NPM</strong></p>

<pre class="brush:as3;">
npm i prologue-client

</pre>

<pre class="brush:as3;">
import PrologueClient from &#39;prologue-client&#39;

</pre>

<h5><strong>Инициализация и конфигурация:</strong></h5>

<pre class="brush:as3;">
PrologueClient.init(
&nbsp; &nbsp; {
&nbsp; &nbsp; &nbsp; &nbsp; &#39;mode&#39;: &#39;demo&#39;,
&nbsp; &nbsp; &nbsp; &nbsp; &#39;servers&#39;: {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#39;demo&#39;: &#39;https://rest-connector.samedia.ru/server/ASKIELQLHY/api/&#39;,
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#39;work&#39;: &#39;&#39;
&nbsp; &nbsp; &nbsp; &nbsp; },
&nbsp; &nbsp; &nbsp; &nbsp; &#39;appRoutes&#39;: {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#39;mainPage&#39;: &#39;/&#39;,
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#39;authorizationPage&#39;: &#39;/login/&#39;,
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#39;userPersonalPage&#39;: &#39;/personal/&#39;,
&nbsp; &nbsp; &nbsp; &nbsp; }
&nbsp; &nbsp; }
);


</pre>

<br>

<a href="https://frontend.prologue-framework.ru/course/client-server.html" target="_blank">
	https://frontend.prologue-framework.ru/course/client-server.html
</a>