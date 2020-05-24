from flask import Flask
from flask import Response
from flask import request
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
import json
import collections
from nltk.tokenize import word_tokenize
import string
application = Flask(__name__)
@application.route('/news', methods=['GET'])
def newsAPI():
    newsAPI = NewsApiClient(api_key='c2db8aff33aa4821aa7dc71a66e8a4cd')
    try:
        topHeadlines = newsAPI.get_top_headlines(sources=None, language='en', country='us', page_size=30)
        topHeadlinesCNN = newsAPI.get_top_headlines(sources='cnn', language='en', page_size=30)
        topHeadlinesFoxNews = newsAPI.get_top_headlines(sources='fox-news', language='en', page_size=30)
        response = {}
        topHeadLine5 = {}
        index = 0
        for headline in topHeadlines['articles']:
            if 'source' in headline and headline['source'] is not None \
                    and 'author' in headline and headline['author'] is not None \
                    and 'description' in headline and headline['description'] is not None \
                    and 'title' in headline and headline['title'] is not None \
                    and 'url' in headline and headline['url'] is not None \
                    and 'urlToImage' in headline and headline['urlToImage']\
                    and 'publishedAt' in headline and headline['publishedAt'] is not None:
                topHeadLine5[index] = headline
                index += 1
            if index == 5:
                break
        # topHeadResp = Response(json.dumps(topHeadLine5), status=200, mimetype='application/json')
        response["top5Headlines"] = topHeadLine5
    #---------------------------------------------------------------------------------------------------------

        topHeadLine4 = {}
        index = 0
        for headline in topHeadlinesCNN['articles']:
            if 'source' in headline and headline['source'] is not None \
                    and 'author' in headline and headline['author'] is not None \
                    and 'description' in headline and headline['description'] is not None \
                    and 'title' in headline and headline['title'] is not None \
                    and 'url' in headline and headline['url'] is not None \
                    and 'urlToImage' in headline and headline['urlToImage'] \
                    and 'publishedAt' in headline and headline['publishedAt'] is not None:
                topHeadLine4[index] = headline
                index += 1
            if index == 4:
                break
        # topHeadCnnResp = Response(json.dumps(topHeadLine4), status=200, mimetype='application/json')
        response["cnn"] = topHeadLine4
    #---------------------------------------------------------------------------------------------------------

        topHeadLine4fox = {}
        index = 0
        for headline in topHeadlinesFoxNews['articles']:
            if 'source' in headline and headline['source'] is not None \
                    and 'author' in headline and headline['author'] is not None \
                    and 'description' in headline and headline['description'] is not None \
                    and 'title' in headline and headline['title'] is not None \
                    and 'url' in headline and headline['url'] is not None \
                    and 'urlToImage' in headline and headline['urlToImage'] \
                    and 'publishedAt' in headline and headline['publishedAt'] is not None:
                topHeadLine4fox[index] = headline
                index += 1
            if index == 4:
                break
        # topHeadFoxNewsResp = Response(json.dumps(topHeadLine4fox), status=200, mimetype='application/json')
        response["fox"] = topHeadLine4fox
    #---------------------------------------------------------------------------------------------------------
        HeadLines = []
        # stopWords = set(stopwords.words('english'))
        stopWords = set()
        wordCounts = {}
        index = 0
        with open("stopwords_en.txt") as f:
            for words in f.readlines():
                stopWords.add(words.strip())
        for headline in topHeadlines['articles']:
            if 'source' in headline and headline['source'] is not None \
                    and 'author' in headline and headline['author'] is not None \
                    and 'description' in headline and headline['description'] is not None \
                    and 'title' in headline and headline['title'] is not None \
                    and 'url' in headline and headline['url'] is not None \
                    and 'urlToImage' in headline and headline['urlToImage'] \
                    and 'publishedAt' in headline and headline['publishedAt'] is not None:
                HeadLines.append(headline['title'])
        for headline in HeadLines:
            for word in word_tokenize(headline):
                word = word.lower()
                if word != '' and word not in string.punctuation and word not in stopWords:
                    if word not in wordCounts:
                        wordCounts[word] = 0
                    wordCounts[word] += 1
        top30Words = collections.OrderedDict(sorted(wordCounts.items(), key=lambda kv: kv[1], reverse=True)[:30])
        top30WordList = list(map(lambda x: [x[0], x[1]], top30Words.items()))

        response["wordCloud"] = top30WordList
        responseFinal = Response(json.dumps(response), status=200, mimetype='application/json')
        return responseFinal
    except:
        return Response(None, status=500)

@application.route('/getSources', methods = ['GET'])
def getSources():
    newsAPI = NewsApiClient(api_key='c2db8aff33aa4821aa7dc71a66e8a4cd')
    category = request.args.get('category')
    if category is None or category.lower() == 'all':
        sources = newsAPI.get_sources(language='en', country='us')
        src = sources['sources'][:10]
        source = {'status':'ok', 'sources':src}
        return Response(json.dumps(source), status=200, mimetype='application/json')
    try:
        sources = newsAPI.get_sources(category=category.lower(), language='en', country='us')
        return Response(json.dumps(sources), status=200, mimetype='application/json')
    except:
        return Response(None, status=500)

@application.route('/news/newsSearch', methods = ['GET'])
def getNewsSearch():
    try:
        newsAPI = NewsApiClient(api_key='c2db8aff33aa4821aa7dc71a66e8a4cd')
        keyword = request.args.get('keyword')
        fromDate = request.args.get('fromDate')
        toDate = request.args.get('toDate')
        source = request.args.get('source')

        if source.lower() == "all":
            source = None

        topHeadlines = newsAPI.get_everything(q=keyword.lower(), sources=source, from_param=fromDate, to=toDate, language='en', sort_by='publishedAt', page_size=30)
        response = {}
        topHeadLines = {}
        index = 0
        for headline in topHeadlines['articles']:
            if 'source' in headline and headline['source'] is not None \
                    and 'author' in headline and headline['author'] is not None \
                    and 'description' in headline and headline['description'] is not None \
                    and 'title' in headline and headline['title'] is not None \
                    and 'url' in headline and headline['url'] is not None \
                    and 'urlToImage' in headline and headline['urlToImage'] \
                    and 'publishedAt' in headline and headline['publishedAt'] is not None:
                topHeadLines[index] = headline
                index += 1
        response["topHeadlines"] = topHeadLines
        return Response(json.dumps(response), status=200, mimetype='application/json')
    except NewsAPIException as err:
        return Response(err.get_message(), status=404)


@application.route('/')
def googleNews():
    return application.send_static_file('googleNews.html')

if __name__ == '__main__':
    application.run(debug=True)
