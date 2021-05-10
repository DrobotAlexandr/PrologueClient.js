<p>В качестве клиента,&nbsp;для работы связки клиент-сервер, будем использовать&nbsp;PrologueClient&nbsp;<img alt="laugh" src="http://frontend.prologue-framework.ru/Prologue/components/editors/ckeditor/ckeditor/plugins/smiley/images/teeth_smile.png" style="height:23px; width:23px" title="laugh" /></p>

<h5><strong>Подключение:</strong></h5>

<pre class="brush:as3;">
&lt;script type=&quot;text/javascript&quot; src=&quot;PrologueClient.js&quot;&gt;&lt;/script&gt;

</pre>

<h5><strong>Инициализация и конфигурация:</strong></h5>

<pre class="brush:as3;">
$httpClient = PrologueClient.init(
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

<p><strong>Параметры:</strong></p>

<table border="1" cellpadding="1" cellspacing="1" style="width:100%">
	<tbody>
		<tr>
			<td>Параметр</td>
			<td>Описание</td>
			<td>Возможные значения</td>
		</tr>
		<tr>
			<td>mode</td>
			<td>Режим работы клиента</td>
			<td>
			<table border="1" cellpadding="1" cellspacing="1" style="width:99%">
				<tbody>
					<tr>
						<td>demo</td>
						<td>Демо-режим. Будет использован демо-сервер.</td>
					</tr>
					<tr>
						<td>work</td>
						<td>Рабочий режим. Будет использован реальный back-end сервер.</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
		<tr>
			<td>servers</td>
			<td>Сервера</td>
			<td>
			<table border="1" cellpadding="1" cellspacing="1" style="width:99%">
				<tbody>
					<tr>
						<td>demo</td>
						<td>http путь к демо-серверу.</td>
					</tr>
					<tr>
						<td>work</td>
						<td>http&nbsp;путь к реальному&nbsp;back-end серверу.</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
		<tr>
			<td>appRoutes</td>
			<td>Ключевые маршруты приложения</td>
			<td>
			<table border="1" cellpadding="1" cellspacing="1" style="width:99%">
				<tbody>
					<tr>
						<td>mainPage</td>
						<td>Путь к главной странице</td>
						<td>Обязательно</td>
					</tr>
					<tr>
						<td>authorizationPage</td>
						<td>Путь к странице авторизации</td>
						<td>Если есть</td>
					</tr>
					<tr>
						<td>userPersonalPage</td>
						<td>Путь к странице после успешной авторизации</td>
						<td>Если есть</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
	</tbody>
</table>

<p>&nbsp;</p>

<blockquote>
<p>После инициализации необходимо использовать глобальный объект&nbsp;<strong>$httpClient</strong> для работы с методами клиента.</p>
</blockquote>
